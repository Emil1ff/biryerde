import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SplashScreenProps } from '../types/navigation';
import { useAuth } from '../contexts/useAuth';
import { useNavigation } from '@react-navigation/native';

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();
  const nav = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      nav.navigate(user ? 'MainTabs' : 'SignUp');
    }, 1000);
  }, [user]);

  useEffect(() => {
    console.log('SplashScreen mounted'); 

    
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    const timer = setTimeout(() => {
      console.log('Navigating to Onboarding...'); 
      navigation.replace('Onboarding');
    }, 3000);

    return () => {
      console.log('SplashScreen cleanup'); 
      clearTimeout(timer);
      spinAnimation.stop();
    };
  }, [navigation, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#8B5CF6', '#A855F7', '#C084FC']}
          style={styles.logo}
        >
          <View style={styles.logoText} />
        </LinearGradient>
      </View>

      {/* Loading Spinner */}
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          {[...Array(8)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.spinnerDot,
                {
                  transform: [
                    { rotate: `${index * 45}deg` },
                    { translateY: -15 },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  spinnerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
    top: '50%',
    left: '50%',
    marginLeft: -3,
    marginTop: -3,
  },
});

export default SplashScreen;