import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Fonts from '../config/Fonts';

interface NotesSectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function NotesSection({
  value,
  onChangeText,
}: NotesSectionProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Notes from Host</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Any additional information for players..."
        placeholderTextColor="#888"
        multiline
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
