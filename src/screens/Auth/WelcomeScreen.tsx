import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { HeroHeader } from '../../components/common/HeroHeader';
import { COLORS } from '../../constants/colors';

export const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <HeroHeader
            title="SplitEasy"
            subtitle="Split expenses, settle faster, stay in sync."
            icon="wallet"
            badge="New in your group"
          />

          <Card style={styles.featureCard} mode="contained">
            <Card.Content>
              <Text style={styles.featureTitle}>Built for real-world splitting</Text>
              <View style={styles.featureRow}>
                <Chip style={styles.featureChip} textStyle={styles.featureText}>Groups</Chip>
                <Chip style={styles.featureChip} textStyle={styles.featureText}>UPI</Chip>
                <Chip style={styles.featureChip} textStyle={styles.featureText}>Reports</Chip>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.footer}>
          <Button mode="contained" onPress={() => navigation.navigate('Login' as never)} style={styles.button}>
            Get started
          </Button>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', gap: 16 },
  footer: { paddingTop: 16 },
  featureCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  featureTitle: { color: COLORS.text, fontWeight: '700', marginBottom: 10 },
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureChip: { backgroundColor: COLORS.primary + '12' },
  featureText: { color: COLORS.primary, fontWeight: '600' },
  button: { marginBottom: 4 }
});
