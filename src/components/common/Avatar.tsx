import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Avatar = () => (
  <View style={styles.container}>
    <Text style={styles.label}>Avatar</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  label: { fontSize: 14 }
});
