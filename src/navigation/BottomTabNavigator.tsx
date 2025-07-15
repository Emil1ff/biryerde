import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../tabs/Home';
import Booking from '../tabs/Booking';
import Profile from '../tabs/Profile';
import Inbox from '../tabs/Inbox';
import Calendar from '../tabs/Calendar';

export type BottomTabParamList = {
  HomeTab: undefined;
  Bookings: undefined;
  Calendar: undefined;
  Inbox: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface TabIconProps {
  iconName: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({ 
  iconName, 
  label, 
  focused,
  onPress
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 4,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [focused]);

  return (
    <TouchableOpacity 
      style={styles.tabButton} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Animated.View style={[
        styles.tabIconContainer,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {focused ? (
          <LinearGradient
            colors={['#8B5CF6', '#A855F7', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeTabIcon}
          >
            <Icon name={focused ? iconName : `${iconName}-outline`} size={22} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <Animated.View style={[
            styles.inactiveTabIcon,
            { opacity: opacityAnim }
          ]}>
            <Icon name={`${iconName}-outline`} size={22} color="rgba(255, 255, 255, 0.8)" />
          </Animated.View>
        )}
      </Animated.View>
      
      <Animated.Text
        style={[
          styles.tabLabel,
          focused ? styles.activeTabLabel : styles.inactiveTabLabel,
          { opacity: focused ? 1 : 0.7 }
        ]}
      >
        {label}
      </Animated.Text>
      
      {/* Indicator dot */}
      <Animated.View 
        style={[
          styles.tabIndicator,
          { opacity: indicatorOpacity }
        ]}
      />
    </TouchableOpacity>
  );
};

const TabBar: React.FC<{
  state: any;
  descriptors: any;
  navigation: any;
}> = ({ state, descriptors, navigation }) => {
  return (
    <LinearGradient
      colors={['rgba(15, 15, 20, 0.9)', '#272727b2']}
      style={styles.tabBar}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = '';
        switch (route.name) {
          case 'HomeTab':
            iconName = 'home';
            break;
          case 'Bookings':
            iconName = 'calendar-clear';
            break;
          case 'Calendar':
            iconName = 'calendar';
            break;
          case 'Inbox':
            iconName = 'chatbubble-ellipses';
            break;
          case 'Profile':
            iconName = 'person';
            break;
        }

        return (
          <TabIcon
            key={index}
            iconName={iconName}
            label={route.name === 'HomeTab' ? 'Home' : route.name}
            focused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </LinearGradient>
  );
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="Bookings" component={Booking} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  activeTabIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  inactiveTabIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#D946EF',
  },
  inactiveTabLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabIndicator: {
    position: 'absolute',
    height: 3,
    width: 15,
    backgroundColor: '#D946EF',
    bottom: -5,
    borderRadius: 8,
  }
});

export default BottomTabNavigator;
