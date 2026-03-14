import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../api/authApi';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { signOut, refreshToken } = useAuth();
  const [logout] = useLogoutMutation();

  return (
    <Screen>
      <Text variant="headlineSmall" style={styles.title}>Settings</Text>
      <List.Section>
        <List.Item title="Profile" left={(props) => <List.Icon {...props} icon="account" />} onPress={() => navigation.navigate('Profile')} />
        <List.Item title="Premium" left={(props) => <List.Icon {...props} icon="star" />} onPress={() => navigation.navigate('Premium')} />
        <List.Item title="Language" left={(props) => <List.Icon {...props} icon="translate" />} onPress={() => navigation.navigate('Language')} />
        <List.Item title="Notifications" left={(props) => <List.Icon {...props} icon="bell" />} onPress={() => navigation.navigate('Notifications')} />
      </List.Section>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={async () => {
            if (refreshToken) {
              await logout({ refreshToken }).unwrap().catch(() => undefined);
            }
            await signOut();
          }}
          textColor={COLORS.danger}
        >
          Sign out
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  footer: { marginTop: 24 }
});
