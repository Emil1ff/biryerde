// import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export const BiometricUtils = {
  async isBiometricAvailable(): Promise<{ available: boolean; biometryType: BiometryTypes | null }> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return { available, biometryType };
    } catch (error) {
      console.error('Biometric availability check failed:', error);
      return { available: false, biometryType: null };
    }
  },

  async authenticate(promptMessage: string = 'Authenticate with biometric'): Promise<{ success: boolean; error?: string }> {
    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });
      return { success, error };
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  },

  async saveBiometricPreference(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem('biometricEnabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Failed to save biometric preference:', error);
    }
  },

  async getBiometricPreference(): Promise<boolean> {
    try {
      const preference = await AsyncStorage.getItem('biometricEnabled');
      return preference ? JSON.parse(preference) : false;
    } catch (error) {
      console.error('Failed to get biometric preference:', error);
      return false;
    }
  },

  async createBiometricKey(keyTag: string): Promise<{ success: boolean; publicKey?: string }> {
    try {
      const { success, publicKey } = await rnBiometrics.createKeys();
      if (success && publicKey) {
        await AsyncStorage.setItem(`biometric_key_${keyTag}`, publicKey);
        return { success: true, publicKey };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to create biometric key:', error);
      return { success: false };
    }
  },

  async deleteBiometricKey(): Promise<{ success: boolean }> {
    try {
      const { success } = await rnBiometrics.deleteKeys();
      return { success };
    } catch (error) {
      console.error('Failed to delete biometric key:', error);
      return { success: false };
    }
  },
};