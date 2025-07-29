import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Fonts from '../config/Fonts';

interface CostSectionProps {
  cost: number;
  onCostChange: (value: string) => void;
}

export default function CostSection({ cost, onCostChange }: CostSectionProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Cost per Player</Text>
      <View style={styles.costInputContainer}>
        <Text style={styles.currencySymbol}>£</Text>
        <TextInput
          style={styles.costInput}
          value={cost === 0 ? '' : cost.toString()}
          onChangeText={onCostChange}
          placeholder="0.00"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
        />
      </View>
    </View>
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
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: Fonts.main,
    paddingLeft: 10,
    color: '#333',
  },
  costInput: {
    flex: 1,
    padding: 10,
    fontFamily: Fonts.main,
  },
});
