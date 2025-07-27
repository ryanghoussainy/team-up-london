import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

export type TabType = 'forYou' | 'nearYou' | 'trySomethingNew';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function GameTabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabTranslateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const switchTab = (tab: TabType) => {
    onTabChange(tab);
    let toValue = 0;
    const tabWidth = (screenWidth - 16) / 3; // Assuming equal width tabs

    if (tab === 'forYou') toValue = 0;
    else if (tab === 'nearYou')
      toValue = tabWidth - 8; // Account for container padding
    else if (tab === 'trySomethingNew') toValue = tabWidth * 2 - 16;

    Animated.spring(tabTranslateX, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  };

  // Initialize indicator position based on active tab
  useEffect(() => {
    const tabWidth = (screenWidth - 16) / 3;
    let initialValue = 0;

    if (activeTab === 'forYou') initialValue = 0;
    else if (activeTab === 'nearYou') initialValue = tabWidth - 8;
    else if (activeTab === 'trySomethingNew') initialValue = tabWidth * 2 - 16;

    tabTranslateX.setValue(initialValue);
  }, []);

  return (
    <View style={[styles.tabContainer, { marginTop: 15 }]}>
      <Animated.View
        style={[
          styles.tabIndicator,
          {
            transform: [{ translateX: tabTranslateX }],
          },
        ]}
      />
      <TouchableOpacity style={styles.tab} onPress={() => switchTab('forYou')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'forYou' && styles.activeTabText,
          ]}
        >
          For You
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => switchTab('nearYou')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'nearYou' && styles.activeTabText,
          ]}
        >
          Near You
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => switchTab('trySomethingNew')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'trySomethingNew' && styles.activeTabText,
          ]}
        >
          Try New
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 2, // Ensure text appears above the sliding indicator
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.main,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    width: '100%',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: `${100 / 3}%`, // One third of the container
    height: '100%',
    backgroundColor: Colours.primary,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
});
