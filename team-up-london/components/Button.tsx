import React, { Fragment } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant: 'primary' | 'create';
  loading?: boolean;
  floating?: boolean;
}

export default function Button({
  onPress,
  title,
  variant,
  loading = false,
  floating = false,
}: ButtonProps) {
  const Icon = () => {
    if (variant === 'create') {
      return <Feather name="plus" size={24} color={Colours.success} />;
    }
    return null;
  };

  const ButtonContent = () => {
    if (loading) return <ActivityIndicator color={Colours.secondary} />;
    return (
      <>
        <Icon />
        <Text style={styles.createButtonText}>{title}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      disabled={loading}
      style={[
        styles.createButton,
        loading && { opacity: 0.7 },
        floating && { position: 'absolute', bottom: 20, width: '90%' },
      ]}
      onPress={onPress}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  createButton: {
    height: 50,
    backgroundColor: Colours.primary,
    borderColor: Colours.highlightButton,
    borderWidth: 0,
    width: '100%',
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
