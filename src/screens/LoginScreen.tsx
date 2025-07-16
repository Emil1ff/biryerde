"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient" // Assuming this library is installed
import Feather from "react-native-vector-icons/Feather" // Import Feather icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons" // For Google icon if Feather doesn't have it

// Define the navigation prop type
export type LoginScreenProps = {
  navigation: {
    navigate: (screen: string) => void
    goBack: () => void
  }
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    console.log("Login:", { email, password, rememberMe })
    // In a real React Native app, you'd handle authentication here
    // and then navigate on success.
    navigation.navigate("MainTabs") // Navigate to your main app screen
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    Alert.alert("Social Login", `Attempting to log in with ${provider}...`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Feather name="arrow-left" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Login to your{"\n"}Account</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Email address input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Password input"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rememberContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
            accessibilityLabel="Remember me checkbox"
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Feather name="check" size={12} color="#FFFFFF" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signInButtonContainer}
          onPress={handleLogin}
          accessibilityLabel="Sign in button"
        >
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>Sign in</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Facebook")}
            accessibilityLabel="Login with Facebook"
          >
            <MaterialCommunityIcons name="facebook" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Google")}
            accessibilityLabel="Login with Google"
          >
            <MaterialCommunityIcons name="google" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Apple")}
            accessibilityLabel="Login with Apple"
          >
            <MaterialCommunityIcons name="apple" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin("Twitter")}
            accessibilityLabel="Login with Twitter"
          >
            <MaterialCommunityIcons name="twitter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Black background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    lineHeight: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  rememberContainer: {
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6", // Purple
    borderColor: "#8B5CF6",
  },
  rememberText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signInButtonContainer: {
    marginBottom: 30,
  },
  signInButton: {
    height: 56,
    borderRadius: 28, // Half of height for pill shape
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
  signUpLink: {
    color: "#8B5CF6", 
    fontSize: 16,
    fontWeight: "600",
  },
})

export default LoginScreen
