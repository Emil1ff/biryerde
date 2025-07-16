import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome'; 
import AppleIcon from 'react-native-vector-icons/Ionicons'; 

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import appleAuth, {
//   AppleAuthRequestScope,
//   AppleAuthRequestOperation,
// } from '@invertase/react-native-apple-authentication';
import { AuthScreenProps } from '@/types/navigation';

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');
  const { fromOnboarding } = route.params || {};

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', 
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // const onBackPress = () => {
      //   handleBackPress();
      //   return true;
      // };

      // const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // return () => subscription.remove();
    }, [fromOnboarding])
  );

  const handleSignInWithPassword = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        console.log('User cancelled Facebook login');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (!data) throw new Error('Failed to get access token');
        console.log('Facebook access token:', data.accessToken.toString());
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google user info:', userInfo);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // Apple Login
  // const handleAppleLogin = async () => {
  //   try {
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: AppleAuthRequestOperation.LOGIN,
  //       requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
  //     });
  //     console.log('Apple auth response:', appleAuthRequestResponse);
  //   } catch (error) {
  //     console.error('Apple login error:', error);
  //   }
  // };

  // const handleBackPress = () => {
  //   if (fromOnboarding) {
  //     navigation.goBack();
  //   } else {
  //     navigation.navigate('Onboarding');
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Image
              source={require('../assets/images/auth/auth.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.title}>Let's you in</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Icon name="facebook" size={20} color="#3b5998" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Icon name="google" size={20} color="#db4437" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
            <AppleIcon name="logo-apple" size={20} color="#000000" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.passwordButtonContainer} onPress={handleSignInWithPassword}>
          <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.passwordButton}>
            <Text style={styles.passwordButtonText}>Sign in with password</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 60,
  },
  image: {
    width: Dimensions.get('window').width * .7,
    height: Dimensions.get('window').height * .3,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  illustration: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  socialButtonsContainer: {
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, .2)',
  },
  socialIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, .2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, .6)',
    marginHorizontal: 16,
    fontSize: 14,
  },
  passwordButtonContainer: {
    marginBottom: 30,
  },
  passwordButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: 'rgba(255, 255, 255, .6)',
    fontSize: 16,
  },
  signUpLink: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;
