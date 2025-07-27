import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface CreateGameButtonProps {
  onPress: () => void;
}

export default function CreateGameButton({ onPress }: CreateGameButtonProps) {
  return (
    <TouchableOpacity style={styles.createButton} onPress={onPress}>
      <Feather name="plus" size={24} color={Colours.success} />
      <Text style={styles.createButtonText}>Create Game</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: Colours.primary,
    borderColor: Colours.highlightButton,
    borderWidth: 0,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    padding: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: Fonts.main,
    marginLeft: 8,
    fontWeight: 'bold',
    color: 'white',
  },
});
