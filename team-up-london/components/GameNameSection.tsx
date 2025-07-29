import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Fonts from '../config/Fonts';

interface GameNameSectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function GameNameSection({
  value,
  onChangeText,
}: GameNameSectionProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        Game Name <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Game Name"
        placeholderTextColor="#888"
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontFamily: Fonts.main,
  },
});
