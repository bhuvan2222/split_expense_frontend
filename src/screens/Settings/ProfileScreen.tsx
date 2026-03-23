import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useDeleteAccountMutation, useGetProfileQuery, useUpdateProfileMutation } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const ProfileScreen = () => {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setPhoneNumber(profile.phoneNumber ?? '');
      setAvatarUrl(profile.avatarUrl ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile({ name, phoneNumber, avatarUrl }).unwrap();
  };

  return (
    <Screen scroll>
      <HeroHeader title="Profile" subtitle="Update your personal details" icon="account" />
      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput mode="outlined" label="Phone" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
          <TextInput mode="outlined" label="Avatar URL" value={avatarUrl} onChangeText={setAvatarUrl} style={styles.input} />
          <Button mode="contained" onPress={handleSave} loading={isLoading} disabled={isLoading} style={styles.primaryButton}>
            Save
          </Button>
          <Button
            mode="outlined"
            textColor={COLORS.danger}
            onPress={async () => {
              await deleteAccount().unwrap();
            }}
            loading={deleting}
            style={styles.deleteButton}
          >
            Delete account
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  primaryButton: { marginTop: 8 },
  deleteButton: { marginTop: 12 }
});
