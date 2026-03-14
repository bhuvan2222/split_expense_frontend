import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const LoadingSpinner = () => (
  <View style={styles.container}>
    <ActivityIndicator animating />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', justifyContent: 'center' }
});
