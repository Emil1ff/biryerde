import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { ServiceProvider } from "./serviceProvider"

export type RootStackParamList = {
  Splash: undefined
  Onboarding: undefined
  Auth: { fromOnboarding?: boolean }
  Login: undefined
  SignUp: undefined
  FillProfile: undefined
  CreatePIN: undefined
  SetFingerprint: undefined
  MainTabs: undefined
  Search: { query?: string }
  Bookmark: undefined
  SpecialOffers: undefined
  Notification: undefined
  MostPopularServices: undefined
  AllServices: undefined
  ServiceListByCategory: { categoryName: string } 
  ServiceDetail: { service: ServiceProvider } 
  EditProfile: undefined
  NotificationSettings: undefined
  Payment: undefined
  AddNewCard: undefined
  Security: undefined
  Language: undefined
  PrivacyPolicy: undefined
  InviteFriends: undefined
  HelpCenterFAQ: undefined
  Contact: undefined
  CustomerServiceChat: undefined
  Filter: undefined
  CallScreen: { contactName: string; contactImage: string }
}

export type BottomTabParamList = {
  HomeTab: undefined
  Bookings: undefined
  Calendar: undefined
  Inbox: undefined
  Profile: undefined
}

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash">
export type OnboardingContainerProps = NativeStackScreenProps<RootStackParamList, "Onboarding">
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, "Auth">
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">
export type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, "SignUp">
export type FillProfileScreenProps = NativeStackScreenProps<RootStackParamList, "FillProfile">
export type CreatePINScreenProps = NativeStackScreenProps<RootStackParamList, "CreatePIN">
export type SetFingerprintScreenProps = NativeStackScreenProps<RootStackParamList, "SetFingerprint">
export type ServiceListByCategoryScreenProps = NativeStackScreenProps<RootStackParamList, "ServiceListByCategory"> // Updated type
export type ServiceDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ServiceDetail"> // New type
export type BookmarkScreenProps = NativeStackScreenProps<RootStackParamList, "Bookmark">
export type SpecialOffersScreenProps = NativeStackScreenProps<RootStackParamList, "SpecialOffers">
export type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, "Notification">
export type EditProfileScreenProps = NativeStackScreenProps<RootStackParamList, "EditProfile">
export type NotificationSettingsScreenProps = NativeStackScreenProps<RootStackParamList, "NotificationSettings">
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, "Payment">
export type AddNewCardScreenProps = NativeStackScreenProps<RootStackParamList, "AddNewCard">
export type SecurityScreenProps = NativeStackScreenProps<RootStackParamList, "Security">
export type LanguageScreenProps = NativeStackScreenProps<RootStackParamList, "Language">
export type PrivacyPolicyScreenProps = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">
export type InviteFriendsScreenProps = NativeStackScreenProps<RootStackParamList, "InviteFriends">
export type HelpCenterFAQScreenProps = NativeStackScreenProps<RootStackParamList, "HelpCenterFAQ">
export type ContactScreenProps = NativeStackScreenProps<RootStackParamList, "Contact">
export type CustomerServiceChatScreenProps = NativeStackScreenProps<RootStackParamList, "CustomerServiceChat">
export type CallScreenProps = NativeStackScreenProps<RootStackParamList, "CallScreen">

export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, "Search">
export type HomeScreenProps = BottomTabScreenProps<BottomTabParamList, "HomeTab">
export type BookingsScreenProps = BottomTabScreenProps<BottomTabParamList, "Bookings">
export type CalendarScreenProps = BottomTabScreenProps<BottomTabParamList, "Calendar">
export type InboxScreenProps = BottomTabScreenProps<BottomTabParamList, "Inbox">
export type ProfileScreenProps = BottomTabScreenProps<BottomTabParamList, "Profile">
export type FilterScreenProps = NativeStackScreenProps<RootStackParamList, "Filter">
export type MostPopularServicesScreenProps = NativeStackScreenProps<RootStackParamList, "MostPopularServices">
export type AllServicesScreenProps = NativeStackScreenProps<RootStackParamList, "AllServices">
