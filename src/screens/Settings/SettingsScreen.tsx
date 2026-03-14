import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List, Text, Card } from 'react-native-paper';
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
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Preferences & Account</Text>
      </View>

      <Card style={styles.menuCard} mode="elevated" elevation={1}>
        <List.Section style={styles.listSection}>
          <List.Item 
            title="Profile" 
            titleStyle={styles.itemTitle}
            left={(props) => <List.Icon {...props} icon="account" color={COLORS.primary} />} 
            right={(props) => <List.Icon {...props} icon="chevron-right" color={COLORS.muted} />}
            onPress={() => navigation.navigate('Profile')} 
          />
          <View style={styles.divider} />
          <List.Item 
            title="Premium" 
            titleStyle={styles.itemTitle}
            left={(props) => <List.Icon {...props} icon="star" color="#f5b041" />} 
            right={(props) => <List.Icon {...props} icon="chevron-right" color={COLORS.muted} />}
            onPress={() => navigation.navigate('Premium')} 
          />
          <View style={styles.divider} />
          <List.Item 
            title="Language" 
            titleStyle={styles.itemTitle}
            left={(props) => <List.Icon {...props} icon="translate" color={COLORS.primary} />} 
            right={(props) => <List.Icon {...props} icon="chevron-right" color={COLORS.muted} />}
            onPress={() => navigation.navigate('Language')} 
          />
          <View style={styles.divider} />
          <List.Item 
            title="Notifications" 
            titleStyle={styles.itemTitle}
            left={(props) => <List.Icon {...props} icon="bell" color={COLORS.primary} />} 
            right={(props) => <List.Icon {...props} icon="chevron-right" color={COLORS.muted} />}
            onPress={() => navigation.navigate('Notifications')} 
          />
        </List.Section>
      </Card>

      <View style={styles.footer}>
        <Button
          mode="contained-tonal"
          icon="logout"
          style={styles.logoutButton}
          buttonColor={COLORS.danger + '1A'}
          textColor={COLORS.danger}
          onPress={async () => {
            if (refreshToken) {
              await logout({ refreshToken }).unwrap().catch(() => undefined);
            }
            await signOut();
          }}
        >
          Sign out
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  title: { color: COLORS.text, fontWeight: 'bold' },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  listSection: { margin: 0, padding: 0 },
  itemTitle: { fontWeight: '500', color: COLORS.text },
  divider: { height: 1, backgroundColor: '#f1f3f5', marginLeft: 56 },
  
  footer: { marginTop: 32 },
  logoutButton: { 
    borderRadius: 12,
    paddingVertical: 6,
  }
});