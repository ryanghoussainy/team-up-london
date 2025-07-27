import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface PlayerCountSectionProps {
  minPlayers: number | null;
  maxPlayers: number | null;
  onMinPlayersChange: (value: string) => void;
  onMaxPlayersChange: (value: string) => void;
  onAdjustMinPlayers: (increase: boolean) => void;
  onAdjustMaxPlayers: (increase: boolean) => void;
}

export default function PlayerCountSection({
  minPlayers,
  maxPlayers,
  onMinPlayersChange,
  onMaxPlayersChange,
  onAdjustMinPlayers,
  onAdjustMaxPlayers,
}: PlayerCountSectionProps) {
  return (
    <View style={styles.fieldRow}>
      <View style={[styles.halfField, { paddingTop: 10 }]}>
        <Text style={styles.label}>
          Min Players <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.numberInputContainer}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onAdjustMinPlayers(false)}
          >
            <Text style={styles.stepperText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.numberInput}
            value={minPlayers?.toString() || ''}
            onChangeText={onMinPlayersChange}
            placeholder="0"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onAdjustMinPlayers(true)}
          >
            <Text style={styles.stepperText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.halfField, { paddingTop: 10 }]}>
        <Text style={styles.label}>
          Max Players <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.numberInputContainer}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onAdjustMaxPlayers(false)}
          >
            <Text style={styles.stepperText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.numberInput}
            value={maxPlayers?.toString() || ''}
            onChangeText={onMaxPlayersChange}
            placeholder="0"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => onAdjustMaxPlayers(true)}
          >
            <Text style={styles.stepperText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfField: {
    flex: 0.48,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginBottom: 6,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  numberInput: {
    flex: 1,
    padding: 10,
    fontFamily: Fonts.main,
    textAlign: 'center',
  },
  stepperButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colours.primary,
  },
});
