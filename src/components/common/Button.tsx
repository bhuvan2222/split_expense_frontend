import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

type Props = {
  mode?: 'text' | 'contained' | 'outlined';
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

export const Button = ({ mode = 'contained', onPress, loading, disabled, children }: Props) => (
  <PaperButton mode={mode} onPress={onPress} loading={loading} disabled={disabled} style={{ marginVertical: 6 }}>
    {children}
  </PaperButton>
);
