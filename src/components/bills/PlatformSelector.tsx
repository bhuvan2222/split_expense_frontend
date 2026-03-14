import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PlatformSelector = () => (
  <View style={styles.container}>
    <Text style={styles.label}>PlatformSelector</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { fontSize: 14 }
});
