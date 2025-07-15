import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { OnboardingContainerProps } from '../types/navigation';
import OnboardingContent1 from '../components/OnboardingContent1';
import OnboardingContent2 from '../components/OnboardingContent2';
import OnboardingContent3 from '../components/OnboardingContent3';
import PaginationDots from '../components/PaginationDots';
// import PaginationDots from '../components/PaginationDots';

const { width, height } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  component: React.ComponentType<OnboardingContentProps>;
}

interface OnboardingContentProps {
  onNext: () => void;
  onGetStarted: () => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onboardingData: OnboardingData[] = [
    { id: 1, component: OnboardingContent1 },
    { id: 2, component: OnboardingContent2 },
    { id: 3, component: OnboardingContent3 },
  ];

  const animateTransition = (direction: 'next' | 'prev') => {
    const toValue = direction === 'next' ? -width : width;
    
    // Fade out and scale down current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset position and update index
      slideAnim.setValue(direction === 'next' ? width : -width);
      
      // Fade in and scale up new content
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = (): void => {
    if (currentIndex < onboardingData.length - 1) {
      animateTransition('next');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    }
  };

  const handleGetStarted = (): void => {
    // Exit animation before navigation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Auth-a parameter ilə göndəririk
      navigation.navigate('Auth', { fromOnboarding: true });
    });
  };

  const CurrentComponent = onboardingData[currentIndex].component;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [
                { translateX: slideAnim },
                { scale: scaleAnim },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <CurrentComponent 
            onNext={handleNext}
            onGetStarted={handleGetStarted}
          />
        </Animated.View>
        
        <PaginationDots 
          currentIndex={currentIndex} 
          totalDots={onboardingData.length} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  contentContainer: {
    flex: 1,
  },
});

export default OnboardingContainer;