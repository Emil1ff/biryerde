"use client"

import { useState } from "react"
import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons" // Import Ionicons
import type { InboxScreenProps } from "../types/navigation"

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

interface ChatMessage {
  id: string
  message?: string
  timestamp: string
  isMe: boolean
  type: "text" | "image" | "voice"
  imageUrl?: string // Added for image messages
}

interface Call {
  id: string
  contactName: string
  contactImage: string
  type: "incoming" | "outgoing" | "missed"
  date: string
  time: string
}

const Inbox: React.FC<InboxScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats") // State for tabs

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
      unreadCount: 0,
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
      unreadCount: 1,
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
      unreadCount: 0,
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

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      message: "Hi Jenny, good morning 😊",
      timestamp: "10:00",
      isMe: false,
      type: "text",
    },
    {
      id: "2",
      message: "I have booked your house cleaning service for December 23 at 10 AM 😊",
      timestamp: "10:00",
      isMe: false,
      type: "text",
    },
    {
      id: "3",
      message: "Hi, morning too Andrew! 😊",
      timestamp: "10:00",
      isMe: true,
      type: "text",
    },
    {
      id: "4",
      message: "Yes, I have received your order. I will come on that date! 😊😊",
      timestamp: "10:00",
      isMe: true,
      type: "text",
    },
    {
      id: "5",
      message: "Good, thanks Jenny.",
      timestamp: "10:01",
      isMe: false,
      type: "text",
    },
    {
      id: "6",
      message: "Here I send a photo of room & my house 😊😊",
      timestamp: "10:02",
      isMe: true,
      type: "text",
    },
    {
      id: "7",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uXkSq1WfdxRtOtGiJ03aIeXTXApdps.png", // Placeholder image for chat
      timestamp: "10:02",
      isMe: true,
      type: "image",
    },
  ]

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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message sending logic here
      console.log("Sending message:", newMessage)
      setNewMessage("")
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
      onPress={() =>
        navigation.navigate("CallScreen", {
          contactName: item.contactName,
          contactImage: item.contactImage,
        })
      }
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

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.chatMessage, item.isMe ? styles.myMessage : styles.theirMessage]}>
      {item.type === "text" && (
        <Text style={[styles.chatMessageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.message}
        </Text>
      )}
      {item.type === "image" && item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.chatImage} resizeMode="cover" />
      )}
      <Text style={[styles.chatTimestamp, item.isMe ? styles.myChatTimestamp : styles.theirChatTimestamp]}>
        {item.timestamp}
      </Text>
    </View>
  )

  if (selectedChat) {
    const selectedUser = messages.find((m) => m.id === selectedChat)

    return (
      <SafeAreaView style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedChat(null)}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.chatUserInfo}>
            <View style={styles.chatAvatarContainer}>
              <Image source={{ uri: selectedUser?.senderImage }} style={styles.chatAvatar} />
              {selectedUser?.isOnline && <View style={styles.chatOnlineIndicator} />}
            </View>
            <View>
              <Text style={styles.chatUserName}>{selectedUser?.senderName}</Text>
              <Text style={styles.chatUserStatus}>{selectedUser?.isOnline ? "Online" : "Last seen recently"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Icon name="call-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <Icon name="information-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages and Input wrapped in KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust as needed for Android
        >
          <FlatList
            data={chatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatMessagesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <View style={styles.messageInputWrapper}>
              <TouchableOpacity style={styles.emojiButton}>
                <Icon name="happy-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
              <TextInput
                style={styles.messageInput}
                placeholder="Message"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity style={styles.attachButton}>
                <Icon name="attach-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <LinearGradient
                colors={["#8B5CF6", "#A855F7"]}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="mic-outline" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "chats" && styles.activeTab]}
          onPress={() => setActiveTab("chats")}
        >
          <Text style={[styles.tabText, activeTab === "chats" && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "calls" && styles.activeTab]}
          onPress={() => setActiveTab("calls")}
        >
          <Text style={[styles.tabText, activeTab === "calls" && styles.activeTabText]}>Calls</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
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
          contentContainerStyle={styles.messagesList} // Reusing messagesList style for calls
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60, // Adjusted for SafeAreaView
    paddingBottom: 10, // Reduced padding for tabs
  },
  title: {
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
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#8B5CF6", // Purple background for active tab
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Keep this for general list padding above the tab bar
  },
  messageItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
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
    borderColor: "#000000",
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
  // Chat Screen Styles
  keyboardAvoidingView: {
    flex: 1, // Ensure KeyboardAvoidingView takes up available space
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60, // Adjusted for SafeAreaView
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  chatUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatOnlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#000000",
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  chatUserStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  chatMessagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chatMessage: {
    maxWidth: "80%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 4,
  },
  chatMessageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  theirMessageText: {
    color: "#FFFFFF",
  },
  chatImage: {
    width: 200, // Adjust as needed
    height: 150, // Adjust as needed
    borderRadius: 8,
    marginBottom: 4,
  },
  chatTimestamp: {
    fontSize: 12,
    alignSelf: "flex-end",
  },
  myChatTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  theirChatTimestamp: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  messageInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#000000",
    alignItems: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Adjusted for keyboard
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    alignItems: "flex-end",
  },
  emojiButton: {
    marginRight: 8,
    paddingVertical: 4,
  },
  messageInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButton: {
    borderRadius: 24,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Inbox
