import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const UpiPayScreen = () => {
  const route = useRoute<any>();
  const upiIntent = route.params?.upiIntent as string | undefined;

  const handleOpen = async () => {
    if (upiIntent) {
      await Linking.openURL(upiIntent);
    }
  };

  return (
    <Screen>
      <HeroHeader title="UPI payment" subtitle="Complete the settlement securely" icon="cellphone-nfc" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text style={styles.subtitle}>Tap below to open your UPI app and complete payment.</Text>
          <Button mode="contained" onPress={handleOpen} disabled={!upiIntent}>
            Open UPI app
          </Button>
          {upiIntent ? <Text style={styles.intent}>{upiIntent}</Text> : null}
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  subtitle: { color: COLORS.muted, marginBottom: 16 },
  intent: { marginTop: 24, color: COLORS.muted, fontSize: 12 }
});
