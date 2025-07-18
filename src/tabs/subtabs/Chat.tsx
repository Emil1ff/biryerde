'use client';

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Modal from 'react-native-modal';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import VoiceMessageBubble from '../../components/VoiceMessageBubble';

interface ChatMessage {
  id: string;
  message?: string;
  timestamp: string;
  isMe: boolean;
  type: 'text' | 'image' | 'voice' | 'file';
  imageUrl?: string;
  filePath?: string;
  fileName?: string;
  audioPath?: string;
  duration?: string;
}

interface ChatScreenProps {
  contactName: string;
  contactImage: string;
  isOnline: boolean;
  onBack: () => void;
}

const initialChatMessages: ChatMessage[] = [
  {
    id: '1',
    message: 'Hi Jenny, good morning 😊',
    timestamp: '10:00',
    isMe: false,
    type: 'text',
  },
  {
    id: '2',
    message:
      'I have booked your house cleaning service for December 23 at 10 AM 😊',
    timestamp: '10:00',
    isMe: false,
    type: 'text',
  },
  {
    id: '3',
    message: 'Hi, morning too Andrew! 😊',
    timestamp: '10:00',
    isMe: true,
    type: 'text',
  },
  {
    id: '4',
    message: 'Yes, I have received your order. I will come on that date! 😊😊',
    timestamp: '10:00',
    isMe: true,
    type: 'text',
  },
  {
    id: '5',
    message: 'Good, thanks Jenny.',
    timestamp: '10:01',
    isMe: false,
    type: 'text',
  },
  {
    id: '6',
    message: 'Here I send a photo of room & my house 😊😊',
    timestamp: '10:02',
    isMe: true,
    type: 'text',
  },
  {
    id: '7',
    imageUrl: '/images/chat-image-placeholder.png',
    timestamp: '10:02',
    isMe: true,
    type: 'image',
  },
  {
    id: '8',
    duration: '0:15',
    audioPath: 'file:///data/user/0/com.yourproject/files/audio_mock_1.mp3', // Example local path
    timestamp: '10:05',
    isMe: false,
    type: 'voice',
  },
  {
    id: '9',
    duration: '0:08',
    audioPath: 'file:///data/user/0/com.yourproject/files/audio_mock_2.mp3', // Example local path
    timestamp: '10:06',
    isMe: true,
    type: 'voice',
  },
  {
    id: '10',
    filePath: 'file:///data/user/0/com.yourproject/files/document.pdf', // Example local path
    fileName: 'MyDocument.pdf',
    timestamp: '10:07',
    isMe: false,
    type: 'file',
  },
];

const CHAT_STORAGE_KEY = 'chatMessages';
const audioRecorderPlayer = new AudioRecorderPlayer();
const { width: screenWidth } = Dimensions.get('window');

const ChatScreen: React.FC<ChatScreenProps> = ({
  contactName,
  contactImage,
  isOnline,
  onBack,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingAmplitude, setRecordingAmplitude] = useState(0); // For waveform visualization
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalPlaybackDuration, setTotalPlaybackDuration] = useState(0);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [selectedImageForViewer, setSelectedImageForViewer] = useState<
    string | null
  >(null);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const panX = useRef(new Animated.Value(0)).current; // For slide to cancel animation

  // Load messages from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          setMessages(initialChatMessages);
        }
      } catch (error) {
        console.error('Failed to load messages from storage', error);
        setMessages(initialChatMessages);
      }
    };
    loadMessages();
  }, []);

  // Save messages to AsyncStorage
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to storage', error);
      }
    };
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Scroll to end when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Audio Recorder/Player Listeners
  useEffect(() => {
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordingDuration(Math.floor(e.currentPosition / 1000));
      setRecordingAmplitude(e.currentMetering || 0); // Get amplitude for waveform
      return;
    });

    audioRecorderPlayer.addPlayBackListener(e => {
      setCurrentPlaybackTime(e.currentPosition);
      setTotalPlaybackDuration(e.duration);
      if (e.currentPosition === e.duration) {
        // Playback finished
        setCurrentPlayingId(null);
        setCurrentPlaybackTime(0);
        setTotalPlaybackDuration(0);
        audioRecorderPlayer.stopPlayer();
      }
      return;
    });

    return () => {
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMe: true,
        type: 'text',
      };
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  const requestAppPermission = async (
    permissionType: 'microphone' | 'media' | 'storage',
  ): Promise<boolean> => {
    let permission: string | undefined;

    switch (permissionType) {
      case 'microphone':
        permission = Platform.select({
          ios: PERMISSIONS.IOS.MICROPHONE,
          android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        });
        break;

      case 'media':
        if (Platform.OS === 'android') {
          permission =
            Platform.Version >= 33
              ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        } else {
          permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        }
        break;

      case 'storage':
        permission = Platform.select({
          ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
          android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        });
        break;
    }

    if (!permission) return false;

    const status = await request(permission);

    if (status === RESULTS.GRANTED) return true;

    const permissionNames: Record<'microphone' | 'media' | 'storage', string> =
      {
        microphone: 'Mikrofon',
        media: 'Şəkil və Video',
        storage: 'Fayl',
      };

    Alert.alert(
      'İcazə Rədd Edildi',
      `Xahiş olunur, davam etmək üçün Tənzimləmələrdən ${permissionNames[permissionType]} icazəsini aktiv edin.`,
    );

    return false;
  };

  // const handleAttachFile = async () => {
  //   const hasPermission = await requestAppPermission('storage');
  //   if (!hasPermission) return;

  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     if (res && res.length > 0) {
  //       const file = res[0];
  //       const newFileMsg: ChatMessage = {
  //         id: Date.now().toString(),
  //         filePath: file.uri,
  //         fileName: file.name || 'Unknown File',
  //         timestamp: new Date().toLocaleTimeString([], {
  //           hour: '2-digit',
  //           minute: '2-digit',
  //         }),
  //         isMe: true,
  //         type: 'file',
  //       };
  //       setMessages(prevMessages => [...prevMessages, newFileMsg]);
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled the file picker');
  //     } else {
  //       console.error('DocumentPicker Error:', err);
  //       Alert.alert('Error', 'Failed to pick file.');
  //     }
  //   }
  // };

  const handleAttachImage = async () => {
    const hasPermission = await requestAppPermission('media');
    if (!hasPermission) return;

    const options: ImagePicker.ImagePickerOptions = {
      mediaType: 'photo', // Can be 'photo', 'video', or 'mixed'
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const newImageMsg: ChatMessage = {
          id: Date.now().toString(),
          imageUrl: asset.uri,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe: true,
          type: 'image',
        };
        setMessages(prevMessages => [...prevMessages, newImageMsg]);
      }
    });
  };

  const handleEmojiButton = () => {
    Alert.alert(
      'Emoji Keyboard',
      'Emoji keyboard functionality would be implemented here.',
    );
  };

  const onStartRecord = async () => {
    const hasPermission = await requestAppPermission('microphone');
    if (!hasPermission) return;

    try {
      const path = Platform.select({
        ios: 'audio.m4a',
        android: 'sdcard/Download/audio.mp4', // Android requires a full path
      });
      const uri = await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingAmplitude(0);
      panX.setValue(0);
      console.log(`Recording started at: ${uri}`);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording.');
      setIsRecording(false);
    }
  };

  const onStopRecord = async (cancelled = false) => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      setRecordingAmplitude(0);

      if (!cancelled && recordingDuration > 0) {
        const newVoiceMsg: ChatMessage = {
          id: Date.now().toString(),
          duration: formatDuration(recordingDuration),
          audioPath: result, // The URI of the recorded audio file
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe: true,
          type: 'voice',
        };
        setMessages(prevMessages => [...prevMessages, newVoiceMsg]);
      } else if (cancelled) {
        Alert.alert(
          'Recording Cancelled',
          'Voice message recording was cancelled.',
        );
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording.');
    }
    setRecordingDuration(0);
  };

  const onPlayPauseAudio = async (id: string, path: string) => {
    if (currentPlayingId === id) {
      // Pause if already playing this audio
      await audioRecorderPlayer.pausePlayer();
      setCurrentPlayingId(null);
    } else {
      // Stop any currently playing audio
      if (currentPlayingId) {
        await audioRecorderPlayer.stopPlayer();
      }
      // Start playing new audio
      try {
        await audioRecorderPlayer.startPlayer(path);
        setCurrentPlayingId(id);
      } catch (err) {
        console.error('Failed to play audio:', err);
        Alert.alert('Error', 'Failed to play audio.');
        setCurrentPlayingId(null);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onStartRecord();
      },
      onPanResponderMove: (evt, gestureState) => {
        panX.setValue(gestureState.dx);
        // Visual feedback for slide to cancel
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -screenWidth * 0.3) {
          // Slide more than 30% of screen width to cancel
          onStopRecord(true); // Cancelled
        } else {
          onStopRecord(false); // Sent
        }
      },
    }),
  ).current;

  const openImageViewer = (imageUrl: string) => {
    setSelectedImageForViewer(imageUrl);
    setIsImageViewerVisible(true);
  };

  const renderChatMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      if (item.type === 'voice' && item.audioPath && item.duration) {
        return (
          <VoiceMessageBubble
            id={item.id}
            audioPath={item.audioPath}
            duration={item.duration}
            isMe={item.isMe}
            timestamp={item.timestamp}
            isPlaying={currentPlayingId === item.id}
            onPlayPause={onPlayPauseAudio}
            currentPlaybackTime={
              currentPlayingId === item.id ? currentPlaybackTime : 0
            }
            totalPlaybackDuration={
              currentPlayingId === item.id ? totalPlaybackDuration : 0
            }
          />
        );
      } else if (item.type === 'image' && item.imageUrl) {
        return (
          <Pressable
            style={[
              styles.chatMessage,
              item.isMe ? styles.myMessage : styles.theirMessage,
            ]}
            onPress={() => openImageViewer(item.imageUrl!)}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.chatImage}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.chatTimestamp,
                item.isMe ? styles.myChatTimestamp : styles.theirChatTimestamp,
              ]}
            >
              {item.timestamp}
            </Text>
          </Pressable>
        );
      } else if (item.type === 'file' && item.filePath && item.fileName) {
        return (
          <Pressable
            style={[
              styles.chatMessage,
              item.isMe ? styles.myMessage : styles.theirMessage,
              styles.fileMessage,
            ]}
            onPress={() =>
              Alert.alert(
                'Open File',
                `Open ${item.fileName} from ${item.filePath}`,
              )
            }
          >
            <View style={styles.fileContent}>
              <Icon
                name="document-outline"
                size={24}
                color={item.isMe ? '#FFFFFF' : '#8B5CF6'}
              />
              <Text
                style={[
                  styles.fileNameText,
                  item.isMe ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {item.fileName}
              </Text>
            </View>
            <Text
              style={[
                styles.chatTimestamp,
                item.isMe ? styles.myChatTimestamp : styles.theirChatTimestamp,
              ]}
            >
              {item.timestamp}
            </Text>
          </Pressable>
        );
      }
      // Default to text message
      return (
        <View
          style={[
            styles.chatMessage,
            item.isMe ? styles.myMessage : styles.theirMessage,
          ]}
        >
          <Text
            style={[
              styles.chatMessageText,
              item.isMe ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.chatTimestamp,
              item.isMe ? styles.myChatTimestamp : styles.theirChatTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      );
    },
    [currentPlayingId, currentPlaybackTime, totalPlaybackDuration],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.chatUserInfo}>
          <View style={styles.chatAvatarContainer}>
            <Image source={{ uri: contactImage }} style={styles.chatAvatar} />
            {isOnline && <View style={styles.chatOnlineIndicator} />}
          </View>
          <View>
            <Text style={styles.chatUserName}>{contactName}</Text>
            <Text style={styles.chatUserStatus}>
              {isOnline ? 'Online' : 'Last seen recently'}
            </Text>
          </View>
        </View>
        <Pressable style={styles.callButton} accessibilityLabel="Call contact">
          <Icon name="call-outline" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.infoButton} accessibilityLabel="Contact info">
          <Icon name="information-circle-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Chat Messages List and Input */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderChatMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatMessagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Message Input Area */}
        <View style={styles.messageInputContainer}>
          {isRecording ? (
            <Animated.View
              style={[
                styles.recordingContainer,
                {
                  transform: [{ translateX: panX }],
                },
              ]}
            >
              <Icon
                name="mic"
                size={24}
                color="#F44336"
                style={styles.recordingIcon}
              />
              <Text style={styles.recordingText}>
                {formatDuration(recordingDuration)}
              </Text>
              {/* Simple amplitude visualization */}
              <View style={styles.amplitudeBarContainer}>
                <View
                  style={[
                    styles.amplitudeBar,
                    { height: Math.max(5, recordingAmplitude / 10) },
                  ]}
                />
                <View
                  style={[
                    styles.amplitudeBar,
                    { height: Math.max(5, recordingAmplitude / 8) },
                  ]}
                />
                <View
                  style={[
                    styles.amplitudeBar,
                    { height: Math.max(5, recordingAmplitude / 6) },
                  ]}
                />
                <View
                  style={[
                    styles.amplitudeBar,
                    { height: Math.max(5, recordingAmplitude / 8) },
                  ]}
                />
                <View
                  style={[
                    styles.amplitudeBar,
                    { height: Math.max(5, recordingAmplitude / 10) },
                  ]}
                />
              </View>
              <Text style={styles.slideToCancelText}>
                {'< Slide to cancel'}
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.messageInputWrapper}>
              <Pressable
                style={styles.emojiButton}
                onPress={handleEmojiButton}
                accessibilityLabel="Open emoji keyboard"
              >
                <Icon
                  name="happy-outline"
                  size={24}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </Pressable>
              <TextInput
                style={styles.messageInput}
                placeholder="Message"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <Pressable
                style={styles.attachButton}
                // onPress={handleAttachFile}
                accessibilityLabel="Attach file"
              >
                <Icon
                  name="attach-outline"
                  size={24}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </Pressable>
              <Pressable
                style={styles.attachButton}
                onPress={handleAttachImage}
                accessibilityLabel="Attach image"
              >
                <Icon
                  name="image-outline"
                  size={24}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </Pressable>
            </View>
          )}

          <Pressable
            style={styles.sendButton}
            onPress={newMessage.length > 0 ? handleSendMessage : undefined} // Only send if text exists
            {...(newMessage.length === 0 ? panResponder.panHandlers : {})} // Attach pan handlers for voice recording
            accessibilityLabel={
              newMessage.length > 0 ? 'Send message' : 'Record voice message'
            }
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7']}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon
                name={newMessage.length > 0 ? 'send' : 'mic-outline'}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Image Viewer Modal */}
      <Modal
        isVisible={isImageViewerVisible}
        onBackdropPress={() => setIsImageViewerVisible(false)}
      >
        <View style={styles.imageViewerContent}>
          <Pressable
            style={styles.imageViewerCloseButton}
            onPress={() => setIsImageViewerVisible(false)}
          >
            <Icon name="close-circle" size={30} color="#FFFFFF" />
          </Pressable>
          {selectedImageForViewer && (
            <Image
              source={{ uri: selectedImageForViewer }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#000000',
  },
  chatUserName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  chatUserStatus: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chatMessagesList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chatMessage: {
    maxWidth: '80%',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8B5CF6',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  chatMessageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#FFFFFF',
  },
  chatImage: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginBottom: 4,
  },
  chatTimestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  myChatTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirChatTimestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  fileMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly different background for files
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fileNameText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1, // Allow text to wrap
  },
  messageInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000000',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    alignItems: 'flex-end',
  },
  emojiButton: {
    marginRight: 6,
    paddingVertical: 4,
  },
  messageInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  sendButton: {
    borderRadius: 24,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  recordingIcon: {
    marginRight: 8,
  },
  recordingText: {
    color: '#F44336', // Red for recording time
    fontSize: 16,
    fontWeight: 'bold',
  },
  amplitudeBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 20, // Fixed height for the container
    justifyContent: 'center',
    overflow: 'hidden', // Ensure bars don't go outside
  },
  amplitudeBar: {
    width: 4,
    backgroundColor: '#F44336',
    marginHorizontal: 1,
    borderRadius: 2,
    minHeight: 2, // Ensure bars are always visible
  },
  slideToCancelText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginLeft: 10,
  },
  imageViewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  imageViewerCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default ChatScreen;
