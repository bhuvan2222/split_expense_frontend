import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const BillItemRow = () => (
  <View style={styles.container}>
    <Text style={styles.label}>BillItemRow</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { fontSize: 14 }
});
