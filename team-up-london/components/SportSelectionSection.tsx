import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SportIcon from './SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface Sport {
  id: string;
  name: string;
  icon: string | null;
  icon_family: string;
}

interface SportSelectionSectionProps {
  sports: Sport[] | null;
  selectedSportId: string | null;
  onSportSelect: (sportId: string) => void;
}

export default function SportSelectionSection({
  sports,
  selectedSportId,
  onSportSelect,
}: SportSelectionSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Select Sport <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <View style={styles.sportsContainer}>
        {sports &&
          sports.length > 0 &&
          sports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.sportItem,
                selectedSportId === sport.id && styles.sportSelected,
              ]}
              onPress={() => onSportSelect(sport.id)}
            >
              <SportIcon
                name={sport.icon || 'default-icon'}
                family={sport.icon_family as ICON_FAMILIES}
                size={24}
                color={selectedSportId === sport.id ? 'white' : Colours.primary}
              />
              <Text
                style={[
                  styles.sportLabel,
                  selectedSportId === sport.id && { color: 'white' },
                ]}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginBottom: 6,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sportItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: Colours.primary,
    borderRadius: 8,
  },
  sportSelected: {
    backgroundColor: Colours.primary,
  },
  sportLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.main,
    color: Colours.primary,
  },
});
