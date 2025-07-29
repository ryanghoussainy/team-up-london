import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface LocationSectionProps {
  location: string;
  locationType: 'Sports Venue' | 'Park' | null;
  onLocationPress: () => void;
  onLocationTypeSelect: (type: 'Sports Venue' | 'Park') => void;
}

export default function LocationSection({
  location,
  locationType,
  onLocationPress,
  onLocationTypeSelect,
}: LocationSectionProps) {
  return (
    <>
      {/* Location */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Location <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TouchableOpacity
          style={[styles.input, styles.locationButton]}
          onPress={onLocationPress}
        >
          <View style={styles.locationButtonContent}>
            <Text
              style={[
                styles.locationButtonText,
                { color: location ? '#000' : '#888' },
              ]}
            >
              {location || 'Select location from map...'}
            </Text>
            <Text style={styles.locationButtonIcon}>📍</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Location Type */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Location Type <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.optionContainer}>
          {['Sports Venue', 'Park'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionBox,
                locationType === type && styles.optionSelected,
              ]}
              onPress={() =>
                onLocationTypeSelect(type as 'Sports Venue' | 'Park')
              }
            >
              <Text
                style={[
                  styles.optionLabel,
                  locationType === type && { color: 'white' },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontFamily: Fonts.main,
  },
  locationButton: {
    justifyContent: 'center',
    minHeight: 50,
  },
  locationButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationButtonText: {
    fontFamily: Fonts.main,
    fontSize: 16,
    flex: 1,
  },
  locationButtonIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  optionContainer: {
    flexDirection: 'row',
  },
  optionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colours.primary,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: Colours.primary,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
});
