"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, Pressable, Animated } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface VoiceMessageBubbleProps {
  id: string
  audioPath: string
  duration: string
  isMe: boolean
  timestamp: string
  // Callbacks for parent to manage global playback state
  onPlayPause: (id: string, path: string) => void
  isPlaying: boolean
  currentPlaybackTime: number // Current playback position in ms
  totalPlaybackDuration: number // Total duration in ms
}

const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  id,
  audioPath,
  duration,
  isMe,
  timestamp,
  onPlayPause,
  isPlaying,
  currentPlaybackTime,
  totalPlaybackDuration,
}) => {
  const progressWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isPlaying && totalPlaybackDuration > 0) {
      const progress = currentPlaybackTime / totalPlaybackDuration
      Animated.timing(progressWidth, {
        toValue: progress,
        duration: 100, // Small duration for smooth updates
        useNativeDriver: false,
      }).start()
    } else if (!isPlaying) {
      // If paused or stopped, hold current progress or reset if at start
      if (currentPlaybackTime === 0) {
        progressWidth.setValue(0)
      }
    }
  }, [isPlaying, currentPlaybackTime, totalPlaybackDuration])

  const interpolatedProgressWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <View style={[styles.voiceMessageContainer, isMe ? styles.myVoiceMessage : styles.theirVoiceMessage]}>
      <Pressable onPress={() => onPlayPause(id, audioPath)} style={styles.playPauseButton}>
        <Icon name={isPlaying ? "pause" : "play"} size={20} color={isMe ? "#FFFFFF" : "#000000"} />
      </Pressable>
      <View style={styles.waveformContainer}>
        <View style={styles.waveformBackground} />
        <Animated.View
          style={[
            styles.waveformProgress,
            {
              width: interpolatedProgressWidth,
              backgroundColor: isMe ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
            },
          ]}
        />
      </View>
      <Text style={[styles.voiceDuration, isMe ? styles.myVoiceDuration : styles.theirVoiceDuration]}>
        {formatTime(currentPlaybackTime)} / {duration}
      </Text>
      <Text style={[styles.voiceTimestamp, isMe ? styles.myVoiceTimestamp : styles.theirVoiceTimestamp]}>
        {timestamp}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  voiceMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    maxWidth: "80%",
    marginBottom: 8,
  },
  myVoiceMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6", // Purple for my messages
    borderBottomRightRadius: 4,
  },
  theirVoiceMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent white for their messages
    borderBottomLeftRadius: 4,
  },
  playPauseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.2)", // Slightly transparent background
  },
  waveformContainer: {
    flex: 1,
    height: 30, // Height of the waveform area
    justifyContent: "center",
    position: "relative",
  },
  waveformBackground: {
    position: "absolute",
    width: "100%",
    height: 4, // Height of the waveform line
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)", // Background for the waveform
  },
  waveformProgress: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 13,
    marginLeft: 8,
    marginRight: 4,
  },
  myVoiceDuration: {
    color: "#FFFFFF",
  },
  theirVoiceDuration: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  voiceTimestamp: {
    fontSize: 11,
    alignSelf: "flex-end",
    marginLeft: "auto", // Push timestamp to the right
  },
  myVoiceTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  theirVoiceTimestamp: {
    color: "rgba(255, 255, 255, 0.6)",
  },
})

export default VoiceMessageBubble
