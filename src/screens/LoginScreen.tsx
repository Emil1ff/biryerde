"use client"
import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const { width, height } = Dimensions.get("window")

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
    navigation.navigate("SetFingerprint")
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    Alert.alert("Social Login", `Attempting to log in with ${provider}...`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Feather name="arrow-left" size={width * 0.08} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Login to your{"\n"}Account</Text>

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
                <Feather name={showPassword ? "eye-off" : "eye"} size={width * 0.05} color="#FFFFFF" />
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
                {rememberMe && <Feather name="check" size={width * 0.03} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
              <MaterialCommunityIcons name="facebook" size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
              accessibilityLabel="Login with Google"
            >
              <MaterialCommunityIcons name="google" size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Apple")}
              accessibilityLabel="Login with Apple"
            >
              <MaterialCommunityIcons name="apple" size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Twitter")}
              accessibilityLabel="Login with Twitter"
            >
              <MaterialCommunityIcons name="twitter" size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", 
  },
  scrollViewContent: {
    flexGrow: 1, 
    justifyContent: "center", 
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05, 
    paddingTop: height * 0.05, 
    paddingBottom: height * 0.03, 
  },
  backButton: {
    marginBottom: height * 0.03, 
    width: width * 0.1, 
    height: width * 0.1, 
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08, 
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: height * 0.05, 
    lineHeight: width * 0.1, 
  },
  inputContainer: {
    marginBottom: height * 0.025, 
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: width * 0.04, 
    marginBottom: height * 0.01, 
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderRadius: 12,
    paddingHorizontal: width * 0.04, 
    paddingVertical: height * 0.02, 
    color: "#FFFFFF",
    fontSize: width * 0.04, 
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
    paddingHorizontal: width * 0.04, 
    paddingVertical: height * 0.02, 
    color: "#FFFFFF",
    fontSize: width * 0.04, 
  },
  eyeButton: {
    paddingHorizontal: width * 0.04, 
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.035, 
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: width * 0.05, 
    height: width * 0.05, 
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: width * 0.03, 
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6", 
    borderColor: "#8B5CF6",
  },
  rememberText: {
    color: "#FFFFFF",
    fontSize: width * 0.04, 
  },
  forgotPasswordText: {
    color: "#8B5CF6", 
    fontSize: width * 0.04, 
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  signInButtonContainer: {
    marginBottom: height * 0.035, 
  },
  signInButton: {
    height: height * 0.07, 
    borderRadius: 28, 
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045, 
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.035, 
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: width * 0.04, 
    fontSize: width * 0.035, 
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.035, 
  },
  socialButton: {
    width: width * 0.15, 
    height: width * 0.15, 
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.025, 
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02, 
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: width * 0.04, 
  },
  signUpLink: {
    color: "#8B5CF6",
    fontSize: width * 0.04, 
    fontWeight: "600",
  },
})

export default LoginScreen
