import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { HeroHeader } from '../../components/common/HeroHeader';
import { COLORS } from '../../constants/colors';

export const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen>
      <View style={styles.container}>
        <HeroHeader
          title="Quick setup"
          subtitle="Connect your groups and start tracking expenses in minutes."
          icon="account-group"
        />
        <Card style={styles.tipCard} mode="contained">
          <Card.Content>
            <Text style={styles.tipTitle}>We will help you onboard</Text>
            <Text style={styles.tipText}>Invite friends, import bills, and see who owes what instantly.</Text>
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={() => navigation.navigate('Login' as never)} style={styles.button}>
          Continue
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  tipCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  tipTitle: { color: COLORS.text, fontWeight: '700', marginBottom: 6 },
  tipText: { color: COLORS.muted },
  button: { marginTop: 24 }
});
