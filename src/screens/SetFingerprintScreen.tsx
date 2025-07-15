import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { SetFingerprintScreenProps } from '../types/navigation';

// Initialize with proper configuration
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const SetFingerprintScreen: React.FC<SetFingerprintScreenProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [biometryType, setBiometryType] = useState<BiometryTypes | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    if (isScanning) {
      pulseAnimation.start();
    } else {
      pulseAnimation.stop();
      pulseAnim.setValue(1);
    }
    return () => pulseAnimation.stop();
  }, [isScanning, pulseAnim]);

  const checkBiometricAvailability = async () => {
    try {
      console.log('Checking biometric availability...');
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      console.log('Biometric check result:', { available, biometryType });
      
      setIsBiometricAvailable(available);
      setBiometryType(biometryType);
      
      if (!available) {
        Alert.alert(
          'Biometric Not Available',
          'Your device does not support biometric authentication or it is not set up. Please ensure you have enrolled biometrics in your device settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                console.log('Open device settings');
              },
            },
            {
              text: 'Skip',
              onPress: () => navigation.navigate('MainTabs'),
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setIsBiometricAvailable(false);
      Alert.alert(
        'Error',
        'Failed to check biometric availability. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => checkBiometricAvailability(),
          },
          {
            text: 'Skip',
            onPress: () => navigation.navigate('MainTabs'),
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleBiometricAuth = async () => {
    if (!isBiometricAvailable) {
      Alert.alert('Error', 'Biometric authentication is not available');
      return;
    }

    console.log('Starting biometric authentication...');
    setIsScanning(true);
    setScanProgress(0);
    progressAnim.setValue(0);

    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000, // Increased duration
      useNativeDriver: false,
    }).start();

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const biometricPrompt = getBiometricPromptMessage();
      
      console.log('Showing biometric prompt:', biometricPrompt.message);
      
      // Use createSignature for better reliability
      const { success, signature, error } = await rnBiometrics.createSignature({
        promptMessage: biometricPrompt.message,
        payload: 'biometric_setup_' + Date.now(), // Add unique payload
        cancelButtonText: 'Cancel',
      });

      clearInterval(progressInterval);
      
      console.log('Biometric result:', { success, error });

      if (success && signature) {
        // Authentication successful
        setScanProgress(100);
        
        // Save biometric preference
        await saveBiometricPreference(true);
        
        setTimeout(() => {
          setIsScanning(false);
          Alert.alert(
            'Success!',
            'Biometric authentication has been set up successfully.',
            [
              {
                text: 'Continue',
                onPress: () => navigation.navigate('MainTabs'),
              },
            ]
          );
        }, 1000);
      } else {
        // Authentication failed or cancelled
        setIsScanning(false);
        setScanProgress(0);
        progressAnim.setValue(0);
        
        if (error && !error.includes('cancelled') && !error.includes('canceled')) {
          Alert.alert(
            'Authentication Failed',
            `Biometric authentication failed: ${error}`,
            [
              {
                text: 'Try Again',
                onPress: () => handleBiometricAuth(),
              },
              {
                text: 'Skip',
                onPress: () => navigation.navigate('MainTabs'),
                style: 'cancel',
              },
            ]
          );
        } else if (error && (error.includes('cancelled') || error.includes('canceled'))) {
          // User cancelled, just reset state
          console.log('User cancelled biometric authentication');
        }
      }
    } catch (error) {
      clearInterval(progressInterval);
      setIsScanning(false);
      setScanProgress(0);
      progressAnim.setValue(0);
      
      console.error('Biometric authentication error:', error);
      
      let errorMessage = 'An error occurred during biometric authentication.';
      
      // Handle specific error cases
      if (error.message) {
        if (error.message.includes('not enrolled')) {
          errorMessage = 'No biometrics enrolled. Please set up biometrics in your device settings first.';
        } else if (error.message.includes('not available')) {
          errorMessage = 'Biometric authentication is not available on this device.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'Permission denied for biometric authentication.';
        }
      }
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => handleBiometricAuth(),
          },
          {
            text: 'Skip',
            onPress: () => navigation.navigate('MainTabs'),
            style: 'cancel',
          },
        ]
      );
    }
  };

  const getBiometricPromptMessage = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return {
          message: 'Place your finger on the Touch ID sensor to set up biometric authentication',
          icon: '👆',
          title: 'Touch ID',
        };
      case BiometryTypes.FaceID:
        return {
          message: 'Look at the front camera to set up Face ID authentication',
          icon: '👤',
          title: 'Face ID',
        };
      case BiometryTypes.Biometrics:
        return {
          message: 'Use your biometric sensor to set up authentication',
          icon: '🔐',
          title: 'Biometric',
        };
      default:
        return {
          message: 'Use your device biometric to set up authentication',
          icon: '👆',
          title: 'Biometric',
        };
    }
  };

  const saveBiometricPreference = async (enabled: boolean) => {
    try {
      // You can use AsyncStorage or your preferred storage method
      // await AsyncStorage.setItem('biometricEnabled', JSON.stringify(enabled));
      console.log('Biometric preference saved:', enabled);
    } catch (error) {
      console.error('Error saving biometric preference:', error);
    }
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderBiometricIcon = () => {
    const biometricInfo = getBiometricPromptMessage();
    
    if (scanProgress === 100) {
      return (
        <View style={styles.successContainer}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successIcon}
          >
            <Text style={styles.successIconText}>✓</Text>
          </LinearGradient>
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.fingerprintContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.fingerprintIcon}
        >
          <Text style={styles.fingerprintIconText}>{biometricInfo.icon}</Text>
        </LinearGradient>
        
        {isScanning && (
          <>
            <View style={[styles.scanRing, styles.scanRing1]} />
            <View style={[styles.scanRing, styles.scanRing2]} />
            <View style={[styles.scanRing, styles.scanRing3]} />
          </>
        )}
      </Animated.View>
    );
  };

  const getBiometricTitle = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'Set Your Touch ID';
      case BiometryTypes.FaceID:
        return 'Set Your Face ID';
      case BiometryTypes.Biometrics:
        return 'Set Your Biometric';
      default:
        return 'Set Your Fingerprint';
    }
  };

  const getBiometricDescription = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'Add Touch ID to make your account more secure';
      case BiometryTypes.FaceID:
        return 'Add Face ID to make your account more secure';
      case BiometryTypes.Biometrics:
        return 'Add biometric authentication to make your account more secure';
      default:
        return 'Add a fingerprint to make your account more secure';
    }
  };

  const getInstructionText = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return 'Please place your finger on the Touch ID sensor to get started';
      case BiometryTypes.FaceID:
        return 'Please look at the front camera to get started';
      case BiometryTypes.Biometrics:
        return 'Please use your biometric sensor to get started';
      default:
        return 'Please put your finger on the fingerprint scanner to get started';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{getBiometricTitle()}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {getBiometricDescription()}
          </Text>
        </View>

        {/* Biometric Icon */}
        <View style={styles.iconContainer}>
          {renderBiometricIcon()}
        </View>

        {/* Progress Text */}
        {isScanning && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {scanProgress < 100
                ? `Authenticating... ${scanProgress}%`
                : 'Biometric authentication set up successfully!'
              }
            </Text>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {!isScanning && scanProgress === 0 && (
          <Text style={styles.instructionText}>
            {getInstructionText()}
          </Text>
        )}

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {!isScanning && scanProgress === 0 && (
            <>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButtonContainer}
                onPress={handleBiometricAuth}
                disabled={!isBiometricAvailable}
              >
                <LinearGradient
                  colors={isBiometricAvailable ? ['#8B5CF6', '#A855F7'] : ['rgba(139, 92, 246, 0.3)', 'rgba(168, 85, 247, 0.3)']}
                  style={styles.continueButton}
                >
                  <Text style={[
                    styles.continueButtonText,
                    !isBiometricAvailable && styles.disabledButtonText
                  ]}>
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 20,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintIconText: {
    fontSize: 50,
  },
  scanRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 100,
  },
  scanRing1: {
    width: 160,
    height: 160,
  },
  scanRing2: {
    width: 200,
    height: 200,
  },
  scanRing3: {
    width: 240,
    height: 240,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconText: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  skipButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonContainer: {
    marginTop: 0,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default SetFingerprintScreen;