import React from 'react';
import { SafeAreaView, ScrollView, StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
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
      <SafeAreaView style={[styles.container, style]}>
        <View pointerEvents="none" style={styles.background}>
          <View style={styles.blobTop} />
          <View style={styles.blobBottom} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.blobTop} />
        <View style={styles.blobBottom} />
      </View>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 24 },
  content: { flex: 1, padding: 20 },
  background: { ...StyleSheet.absoluteFillObject },
  blobTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.primary + '14',
    top: -120,
    right: -80,
  },
  blobBottom: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.secondary + '12',
    bottom: -160,
    left: -120,
  },
});
