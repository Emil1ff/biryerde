import { Easing } from 'react-native';

export const customSlideFromRight = ({ current, layouts }: any) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
    extrapolate: 'clamp',
  });

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const scale = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [
        { translateX },
        { scale },
      ],
      opacity,
    },
  };
};

// Smooth slide with shadow
export const smoothSlideFromRight = ({ current, layouts }: any) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
      shadowColor: '#000',
      shadowOffset: {
        width: -5,
        height: 0,
      },
      shadowOpacity,
      shadowRadius: 10,
      elevation: 5,
    },
  };
};

export const slideConfig = {
  animation: 'timing' as const,
  config: {
    duration: 150,
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  },
};