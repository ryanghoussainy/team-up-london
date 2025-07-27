import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface SearchFilterHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  searchWidth: Animated.Value;
  onFilterPress: () => void;
}

export default function GameSearchFilterHeader({
  searchQuery,
  setSearchQuery,
  searchActive,
  setSearchActive,
  searchWidth,
  onFilterPress,
}: SearchFilterHeaderProps) {
  const toggleSearch = () => {
    if (!searchActive) {
      setSearchActive(true);
      Animated.timing(searchWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(searchWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchActive(false);
        setSearchQuery('');
      });
    }
  };

  const interpolatedWidth = searchWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '52%'],
  });

  const screenWidth = Dimensions.get('window').width;
  const maxSearchWidth = screenWidth * 0.3;

  const interpolatedFilterShift = searchWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -maxSearchWidth * 0.1],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discovery</Text>

      <View style={styles.controlsContainer}>
        {/* Filter button */}
        <Animated.View
          style={{ transform: [{ translateX: interpolatedFilterShift }] }}
        >
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Feather name="filter" size={24} color={Colours.primary} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Search bar */}
        <Animated.View
          style={[
            styles.animatedSearchContainer,
            { width: interpolatedWidth, marginLeft: 2 },
          ]}
        >
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoFocus={searchActive}
          />
        </Animated.View>

        {/* Search icon */}
        <TouchableOpacity
          onPress={toggleSearch}
          style={[styles.searchButton, { marginLeft: 2 }]}
        >
          <Feather
            name={searchActive ? 'x' : 'search'}
            size={24}
            color={Colours.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 24,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.main,
    marginTop: 12,
    marginRight: 60,
    zIndex: 0,
    position: 'relative',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: Colours.extraButtons,
    outlineColor: Colours.primary,
    borderWidth: 0,
    borderColor: Colours.primary,
    padding: 10,
    borderRadius: 16,
    marginLeft: 0,
    height: 50,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  animatedSearchContainer: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: Fonts.main,
  },
  searchButton: {
    padding: 12,
    backgroundColor: Colours.extraButtons,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: Colours.primary,
    marginRight: 8,
  },
});
