import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Platform } from "react-native"

import SplashScreen from "./src/screens/SplashScreen"
import OnboardingContainer from "./src/screens/OnboardingContainer"
import AuthScreen from "./src/screens/AuthScreen"
import LoginScreen from "./src/screens/LoginScreen"
import SignUpScreen from "./src/screens/SignUpScreen"
import FillProfileScreen from "./src/screens/FillProfileScreen"
import CreatePINScreen from "./src/screens/CreatePINScreen"
import SetFingerprintScreen from "./src/screens/SetFingerprintScreen"
import type { RootStackParamList } from "./src/types/navigation"
import SearchScreen from "./src/screens/SearchScreen" 
import NotificationsScreen from "./src/tabs/subtabs/Notification" 
import MostPopularServicesScreen from "./src/tabs/subtabs/MostPopularServices"
import BottomTabNavigator from "./src/navigation/BottomTabNavigator"
import Bookmark from "./src/tabs/subtabs/Bookmark" 
import SpecialOffers from "./src/tabs/subtabs/SpecialOffers"
import Filter from "./src/tabs/subtabs/Filter" 
import AllServices from "./src/tabs/subtabs/AllServices" 
import ServiceDetailScreen from "./src/tabs/subtabs/ServiceDetail"
import ServiceListByCategoryScreen from "./src/tabs/subtabs/ServiceListByCategoryScreen"
import EditProfile from "./src/tabs/subtabs/EditProfile"
import NotificationSettings from "./src/tabs/subtabs/NotificationSettings"
import Payment from "./src/tabs/subtabs/Payment"
import AddCard from "./src/tabs/subtabs/AddCard"
import Security from "./src/tabs/subtabs/Security"
import Language from "./src/tabs/subtabs/Language"
import PrivacyPolicy from "./src/tabs/subtabs/PrivacyPolicy"
import InviteFriends from "./src/tabs/subtabs/InviteFriends"
import HelpCenter from "./src/tabs/subtabs/HelpCenter"
import CustomerService from "./src/tabs/subtabs/CustomerService"
import Contact from "./src/tabs/subtabs/Contact"
import Call from "./src/tabs/subtabs/Call"


const Stack = createNativeStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          presentation: "card",
          animationTypeForReplace: "push",
          ...(Platform.OS === "android" && {
            animation: "slide_from_right",
          }),
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingContainer} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="FillProfile" component={FillProfileScreen} />
        <Stack.Screen name="CreatePIN" component={CreatePINScreen} />
        <Stack.Screen name="SetFingerprint" component={SetFingerprintScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Bookmark" component={Bookmark} />
        <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
        <Stack.Screen name="Notification" component={NotificationsScreen} />
        <Stack.Screen name="MostPopularServices" component={MostPopularServicesScreen} />
        <Stack.Screen name="Filter" component={Filter} />
        <Stack.Screen name="AllServices" component={AllServices} />
        <Stack.Screen name="ServiceListByCategory" component={ServiceListByCategoryScreen} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="AddNewCard" component={AddCard} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen name="HelpCenterFAQ" component={HelpCenter} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="CustomerServiceChat" component={CustomerService} />
        <Stack.Screen name="CallScreen" component={Call} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
