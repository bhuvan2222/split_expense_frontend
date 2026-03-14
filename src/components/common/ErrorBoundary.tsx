import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ErrorBoundary = () => (
  <View style={styles.container}>
    <Text style={styles.label}>ErrorBoundary</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { fontSize: 14 }
});
