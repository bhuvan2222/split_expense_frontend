import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

export const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text variant="headlineLarge" style={styles.title}>
          SplitEasy
        </Text>
        <Text style={styles.subtitle}>Split expenses, settle faster, stay in sync.</Text>
      </View>
      <Button mode="contained" onPress={() => navigation.navigate('Login' as never)} style={styles.button}>
        Get started
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between', backgroundColor: COLORS.background },
  hero: { marginTop: 60 },
  title: { color: COLORS.primary, fontWeight: '800' },
  subtitle: { marginTop: 12, color: COLORS.muted, fontSize: 16 },
  button: { marginBottom: 24 }
});
