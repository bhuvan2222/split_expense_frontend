import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DebtGraph = () => (
  <View style={styles.container}>
    <Text style={styles.label}>DebtGraph</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { fontSize: 14 }
});
