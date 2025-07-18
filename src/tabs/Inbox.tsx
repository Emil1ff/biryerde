import { useState } from "react"
import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons" // Import Ionicons
import ChatScreen from "./subtabs/Chat"

interface Message {
  id: string
  senderName: string
  senderImage: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messageType: "text" | "image" | "voice"
}

interface Call {
  id: string
  contactName: string
  contactImage: string
  type: "incoming" | "outgoing" | "missed"
  date: string
  time: string
}

const messages: Message[] = [
  {
    id: "1",
    senderName: "Jenny Wilson",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "I have booked your house cleaning service for December 23 at 10 AM.",
    timestamp: "13:29",
    unreadCount: 2,
    isOnline: true,
    messageType: "text",
  },
  {
    id: "2",
    senderName: "Alfonzo Schuessler",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "I just finished 😊😊",
    timestamp: "10:48",
    unreadCount: 3,
    isOnline: false,
    messageType: "text",
  },
  {
    id: "3",
    senderName: "Benny Spanbauer",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "Wow, this is amazing 🔥🔥🔥",
    timestamp: "09:25",
    unreadCount: 0,
    isOnline: true,
    messageType: "text",
  },
  {
    id: "4",
    senderName: "Marci Santer",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "Wow, this is really epic 🤩",
    timestamp: "Yesterday",
    unreadCount: 2,
    isOnline: false,
    messageType: "text",
  },
  {
    id: "5",
    senderName: "Kylee Danford",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "Just ideas for next time 😅",
    timestamp: "Dec 20, 2024",
    unreadCount: 0,
    isOnline: true,
    messageType: "text",
  },
  {
    id: "6",
    senderName: "Merrill Kervin",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "How are you? 😊😊",
    timestamp: "Dec 19, 2024",
    unreadCount: 0,
    isOnline: false,
    messageType: "text",
  },
  {
    id: "7",
    senderName: "Pedro Huard",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "Perfect! 👍👍👍",
    timestamp: "Dec 18, 2024",
    unreadCount: 0,
    isOnline: true,
    messageType: "text",
  },
  {
    id: "8",
    senderName: "Edgar Torrey",
    senderImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    lastMessage: "See you soon!",
    timestamp: "Dec 17, 2024",
    unreadCount: 0,
    isOnline: false,
    messageType: "text",
  },
]
const calls: Call[] = [
  {
    id: "c1",
    contactName: "Lauralee Quintero",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "incoming",
    date: "Dec 19, 2024",
    time: "10:00",
  },
  {
    id: "c2",
    contactName: "Tanner Stafford",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "outgoing",
    date: "Dec 17, 2024",
    time: "11:30",
  },
  {
    id: "c3",
    contactName: "Augustina Midgett",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "missed",
    date: "Nov 28, 2024",
    time: "09:00",
  },
  {
    id: "c4",
    contactName: "Geoffrey Mott",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "outgoing",
    date: "Nov 24, 2024",
    time: "14:00",
  },
  {
    id: "c5",
    contactName: "Roselle Ehrman",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "incoming",
    date: "Nov 14, 2024",
    time: "16:00",
  },
  {
    id: "c6",
    contactName: "Thad Eddings",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "outgoing",
    date: "Oct 30, 2024",
    time: "10:00",
  },
  {
    id: "c7",
    contactName: "Daryl Nelis",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "incoming",
    date: "Oct 29, 2024",
    time: "12:00",
  },
  {
    id: "c8",
    contactName: "Francene Vandyne",
    contactImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    type: "outgoing",
    date: "Oct 28, 2024",
    time: "15:00",
  },
]

const Inbox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats") // State for tabs

  const filteredMessages = messages.filter((message) =>
    message.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredCalls = calls.filter((call) => call.contactName.toLowerCase().includes(searchQuery.toLowerCase()))

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Icon name="mic-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
      case "image":
        return <Icon name="image-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
      default:
        return null
    }
  }

  const getCallIcon = (type: Call["type"]) => {
    switch (type) {
      case "incoming":
        return <Icon name="call-outline" size={16} color="#10B981" /> // Green for incoming
      case "outgoing":
        return <Icon name="call-made-outline" size={16} color="#8B5CF6" /> // Purple for outgoing
      case "missed":
        return <Icon name="call-missed-outline" size={16} color="#EF4444" /> // Red for missed
      default:
        return null
    }
  }

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => setSelectedChat(item.id)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.senderImage }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <View style={styles.lastMessageContainer}>
            {getMessageIcon(item.messageType)}
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCallItem = ({ item }: { item: Call }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => {
        // In a real app, you would navigate to a CallDetailScreen
        console.log("Navigating to call screen for:", item.contactName)
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.contactImage }} style={styles.avatar} />
      </View>
      <View style={styles.callContent}>
        <Text style={styles.callContactName}>{item.contactName}</Text>
        <View style={styles.callDetails}>
          {getCallIcon(item.type)}
          <Text style={styles.callTypeAndDate}>
            {item.type === "incoming" && "Incoming"}
            {item.type === "outgoing" && "Outgoing"}
            {item.type === "missed" && "Missed"}
            {" | "}
            {item.date}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButtonSmall}>
        <Icon name="call-outline" size={24} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (selectedChat) {
    const selectedUser = messages.find((m) => m.id === selectedChat)
    if (!selectedUser) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.emptyStateTitle}>Chat Not Found</Text>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Text style={styles.emptyStateDescription}>Go back to Inbox</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )
    }
    return (
      <ChatScreen
        contactName={selectedUser.senderName}
        contactImage={selectedUser.senderImage}
        isOnline={selectedUser.isOnline}
        onBack={() => setSelectedChat(null)}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-purple-r00723.png" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="ellipsis-vertical-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "chats" && styles.activeTab]}
          onPress={() => setActiveTab("chats")}
        >
          <Text style={[styles.tabText, activeTab === "chats" && styles.activeTabText]}>Chats</Text>
          {activeTab === "chats" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "calls" && styles.activeTab]}
          onPress={() => setActiveTab("calls")}
        >
          <Text style={[styles.tabText, activeTab === "calls" && styles.activeTabText]}>Calls</Text>
          {activeTab === "calls" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      {activeTab === "chats" ? (
        filteredMessages.length > 0 ? (
          <FlatList
            data={filteredMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="chatbox-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyStateTitle}>No Messages Found</Text>
            <Text style={styles.emptyStateDescription}>
              {searchQuery ? "No messages match your search." : "Start a conversation with service providers."}
            </Text>
          </View>
        )
      ) : filteredCalls.length > 0 ? (
        <FlatList
          data={filteredCalls}
          renderItem={renderCallItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList} 
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="call-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyStateTitle}>No Calls Found</Text>
          <Text style={styles.emptyStateDescription}>
            {searchQuery ? "No calls match your search." : "Your call history will appear here."}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={["#8B5CF6", "#A855F7"]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="add-outline" size={30} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="book-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chatbox-ellipses" size={24} color="#8B5CF6" />
          <Text style={[styles.navText, styles.activeNavText]}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Dark background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 0, // Adjust for Android status bar
    paddingBottom: 10,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    position: "relative",
  },
  activeTab: {
    // No background color for active tab, just indicator
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#8B5CF6", // Purple indicator
    borderRadius: 1.5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB and bottom nav
  },
  messageItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  callItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#1A1A1A", // Match background
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  messagePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    flexShrink: 1,
    marginLeft: 4, // Space between icon and text
  },
  unreadBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  // Call Item Specific Styles
  callContent: {
    flex: 1,
  },
  callContactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  callTypeAndDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
  },
  callButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 100, // Above the bottom navigation
    right: 20,
    borderRadius: 30,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  // Bottom Navigation Bar
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Same as background
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 10, // Adjust for iPhone X notch
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  navText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  activeNavText: {
    color: "#8B5CF6",
  },
})

export default Inbox
