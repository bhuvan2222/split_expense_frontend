import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useCreateGroupMutation } from '../../api/groupsApi';
import { COLORS } from '../../constants/colors';

export const CreateGroupScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleSubmit = async () => {
    setError('');
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Group name is required.');
      return;
    }
    const payload: { name: string; description?: string; emoji?: string; currency?: string } = { name: trimmedName };
    if (description.trim()) payload.description = description.trim();
    if (emoji.trim()) payload.emoji = emoji.trim();
    if (currency.trim()) payload.currency = currency.trim();

    try {
      const result = await createGroup(payload).unwrap();
      navigation.navigate('GroupDetail', { groupId: result.id });
    } catch (err: any) {
      const message = err?.data?.error?.message || 'Failed to create group';
      setError(message);
    }
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Create group</Text>
      <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput mode="outlined" label="Emoji" value={emoji} onChangeText={setEmoji} style={styles.input} />
      <TextInput mode="outlined" label="Currency" value={currency} onChangeText={setCurrency} style={styles.input} />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading || !name.trim()}>
        Create
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: 16, color: COLORS.primary },
  input: { marginBottom: 12 }
});
