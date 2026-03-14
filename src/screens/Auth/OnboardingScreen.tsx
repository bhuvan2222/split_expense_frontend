import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Quick setup</Text>
      <Text style={styles.subtitle}>Connect your groups and start tracking expenses in minutes.</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login' as never)}>
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.background },
  title: { color: COLORS.primary, marginBottom: 12 },
  subtitle: { color: COLORS.muted, marginBottom: 24 }
});
