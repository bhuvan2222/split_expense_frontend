import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { COLORS } from '../../constants/colors';

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
      <Text variant="headlineSmall" style={styles.title}>UPI Payment</Text>
      <Text style={styles.subtitle}>Tap below to open your UPI app and complete payment.</Text>
      <Button mode="contained" onPress={handleOpen} disabled={!upiIntent}>
        Open UPI app
      </Button>
      {upiIntent ? <Text style={styles.intent}>{upiIntent}</Text> : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  subtitle: { color: COLORS.muted, marginBottom: 24 },
  intent: { marginTop: 24, color: COLORS.muted, fontSize: 12 }
});
