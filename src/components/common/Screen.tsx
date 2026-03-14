import React from 'react';
import { SafeAreaView, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

export const Screen = ({
  children,
  style,
  scroll
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scroll?: boolean;
}) => {
  if (scroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.background }, style]}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.background, padding: 20 }, style]}>
      {children}
    </SafeAreaView>
  );
};
