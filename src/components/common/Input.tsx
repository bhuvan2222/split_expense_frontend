import React from 'react';
import { TextInput } from 'react-native-paper';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  multiline?: boolean;
};

export const Input = ({ label, value, onChangeText, secureTextEntry, keyboardType, multiline }: Props) => (
  <TextInput
    mode="outlined"
    label={label}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    multiline={multiline}
    style={{ marginVertical: 6 }}
  />
);
