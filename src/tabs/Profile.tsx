"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Switch, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons" // Using Ionicons as per the image

interface ProfileOption {
  id: string
  title: string
  icon: string // Icon name from Ionicons
  type: "navigation" | "switch" | "action"
  value?: boolean
  onPress?: () => void
  rightText?: string // For Language option
}

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)

  const userInfo = {
    name: "Andrew Ainsley",
    email: "andrew_ainsley@yourdomain.com",
    profileImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    memberSince: "December 2023", // Example stat
    completedBookings: 24,
    rating: 4.8,
  }

  const profileOptions: ProfileOption[] = [
    {
      id: "1",
      title: "Edit Profile",
      icon: "person-outline",
      type: "navigation",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      id: "2",
      title: "Notification",
      icon: "notifications-outline",
      type: "navigation",
      onPress: () => navigation.navigate("NotificationSettings"), // Changed to NotificationSettings
    },
    {
      id: "3",
      title: "Payment",
      icon: "card-outline",
      type: "navigation",
      onPress: () => navigation.navigate("Payment"),
    },
    {
      id: "4",
      title: "Security",
      icon: "shield-checkmark-outline",
      type: "navigation",
      onPress: () => navigation.navigate("Security"),
    },
    {
      id: "5",
      title: "Language",
      icon: "language-outline",
      type: "navigation",
      rightText: "English (US)",
      onPress: () => navigation.navigate("Language"),
    },
    {
      id: "6",
      title: "Dark Mode",
      icon: "eye-outline",
      type: "switch",
      value: darkModeEnabled,
      onPress: () => setDarkModeEnabled(!darkModeEnabled),
    },
    {
      id: "7",
      title: "Privacy Policy",
      icon: "lock-closed-outline",
      type: "navigation",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      id: "8",
      title: "Help Center",
      icon: "information-circle-outline",
      type: "navigation",
      onPress: () => navigation.navigate("HelpCenterFAQ"), // Navigate to HelpCenterFAQ
    },
    {
      id: "9",
      title: "Invite Friends",
      icon: "people-outline",
      type: "navigation",
      onPress: () => navigation.navigate("InviteFriends"),
    },
    {
      id: "10",
      title: "Logout",
      icon: "log-out-outline",
      type: "action",
      onPress: () => handleLogout(),
    },
  ]

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          console.log("User logged out")
          // Implement actual logout logic, e.g., clear user session and navigate to Auth screen
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'Auth' }],
          // });
        },
      },
    ])
  }

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionItem, option.title === "Logout" && styles.logoutOption]}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.optionIconContainer, option.title === "Logout" && styles.logoutIconContainer]}>
          <Icon
            name={option.icon}
            size={22}
            color={option.title === "Logout" ? "#F44336" : "#8B5CF6"} // Purple for regular, red for logout
          />
        </View>
        <Text style={[styles.optionTitle, option.title === "Logout" && styles.logoutTitle]}>{option.title}</Text>
      </View>
      <View style={styles.optionRight}>
        {option.type === "switch" ? (
          <Switch
            value={option.value}
            onValueChange={option.onPress}
            trackColor={{ false: "#424242", true: "#8B5CF6" }} // Purple track when true
            thumbColor={option.value ? "#FFFFFF" : "#E0E0E0"}
            ios_backgroundColor="#424242"
          />
        ) : (
          <>
            {option.rightText && <Text style={styles.optionRightText}>{option.rightText}</Text>}
            <Icon
              name="chevron-forward"
              size={24}
              color={option.title === "Logout" ? "#F44336" : "rgba(255, 255, 255, 0.5)"}
            />
          </>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="lightning-bolt" size={28} color="#8B5CF6" style={styles.headerLogo} />
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="ellipsis-horizontal" size={24} color="#E0E0E0" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#8B5CF6", "#00E5FF"]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editImageButton}>
                <Icon name="pencil-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.completedBookings}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <LinearGradient
              colors={["#4CAF50", "#8BC34A"]} // Green gradient
              style={styles.quickActionGradient}
            >
              <Icon name="wallet-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <LinearGradient
              colors={["#FFC107", "#FFEB3B"]} // Yellow gradient
              style={styles.quickActionGradient}
            >
              <Icon name="gift-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <LinearGradient
              colors={["#F44336", "#E57373"]} // Red gradient
              style={styles.quickActionGradient}
            >
              <Icon name="trophy-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <LinearGradient
              colors={["#2196F3", "#64B5F6"]} // Blue gradient
              style={styles.quickActionGradient}
            >
              <Icon name="bar-chart-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Options Container */}
        <View style={styles.optionsContainer}>{profileOptions.map(renderProfileOption)}</View>

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 20,
    paddingBottom: 15,
  },
  headerLogo: {
    // No specific style needed, just for positioning
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  profileGradient: {
    padding: 24,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: "#CFD8DC",
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: "#E0E0E0",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  quickActionText: {
    fontSize: 12,
    color: "#E0E0E0",
    fontWeight: "500",
    textAlign: "center",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Darker background for options
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  logoutOption: {
    backgroundColor: "rgba(244, 67, 54, 0.1)", // Light red background for logout
    borderWidth: 1,
    borderColor: "#F44336",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.15)", // Light purple background for icons
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logoutIconContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.15)", // Light red background for logout icon
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
  logoutTitle: {
    color: "#F44336",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRightText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    marginRight: 8,
  },
  appVersion: {
    alignItems: "center",
    paddingBottom: 100,
    marginTop: 20,
  },
  versionText: {
    fontSize: 13,
    color: "#757575",
  },
})

export default ProfileScreen
