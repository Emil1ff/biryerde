import React, { useContext, createContext } from 'react';
import { ScrollView, View } from 'react-native';

interface TabBarContextType {
  collapseTabBar: () => void;
}

export const TabBarContext = createContext<TabBarContextType | null>(null);

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  scrollable = true 
}) => {
  const tabBarContext = useContext(TabBarContext);

  const handleScroll = () => {
    if (tabBarContext) {
      tabBarContext.collapseTabBar();
    }
  };

  if (scrollable) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};