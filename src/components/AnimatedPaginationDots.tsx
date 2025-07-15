import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface AnimatedPaginationDotsProps {
  currentIndex: number;
  totalDots: number;
}

const AnimatedPaginationDots: React.FC<AnimatedPaginationDotsProps> = ({ 
  currentIndex, 
  totalDots 
}) => {
  const animatedValues = useRef(
    Array.from({ length: totalDots }, () => new Animated.Value(0))
  ).current;

  const scaleValues = useRef(
    Array.from({ length: totalDots }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    animatedValues.forEach((animValue, index) => {
      const isActive = index === currentIndex;
      
      Animated.parallel([
        Animated.timing(animValue, {
          toValue: isActive ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(scaleValues[index], {
          toValue: isActive ? 1.2 : 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentIndex, animatedValues, scaleValues]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animValue, index) => {
        const width = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 24],
        });

        const backgroundColor = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(255, 255, 255, 0.3)', '#8B5CF6'],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width,
                backgroundColor,
                transform: [{ scale: scaleValues[index] }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default AnimatedPaginationDots;