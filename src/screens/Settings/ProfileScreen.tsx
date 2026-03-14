import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useDeleteAccountMutation, useGetProfileQuery, useUpdateProfileMutation } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';

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
      <Text variant="headlineSmall" style={styles.title}>Profile</Text>
      <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput mode="outlined" label="Phone" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
      <TextInput mode="outlined" label="Avatar URL" value={avatarUrl} onChangeText={setAvatarUrl} style={styles.input} />
      <Button mode="contained" onPress={handleSave} loading={isLoading} disabled={isLoading}>
        Save
      </Button>
      <Button
        mode="outlined"
        textColor={COLORS.danger}
        onPress={async () => {
          await deleteAccount().unwrap();
        }}
        loading={deleting}
        style={{ marginTop: 12 }}
      >
        Delete account
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  input: { marginBottom: 12 }
});
