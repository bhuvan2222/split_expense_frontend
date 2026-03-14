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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string; emoji?: string; currency?: string }>({});

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFieldErrors({ name: 'Group name is required.' });
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
      const fields = err?.data?.error?.fields;
      if (Array.isArray(fields) && fields.length > 0) {
        const next: { name?: string; description?: string; emoji?: string; currency?: string } = {};
        fields.forEach((f: { field?: string; message?: string }) => {
          if (!f?.field || !f?.message) return;
          if (f.field === 'name') next.name = f.message;
          if (f.field === 'description') next.description = f.message;
          if (f.field === 'emoji') next.emoji = f.message;
          if (f.field === 'currency') next.currency = f.message;
        });
        setFieldErrors(next);
        setError('');
        return;
      }
      const message = err?.data?.error?.message || 'Failed to create group';
      setError(message);
    }
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Create group</Text>
      <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} style={styles.input} />
      {fieldErrors.name ? <HelperText type="error">{fieldErrors.name}</HelperText> : null}
      <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
      {fieldErrors.description ? <HelperText type="error">{fieldErrors.description}</HelperText> : null}
      <TextInput mode="outlined" label="Emoji" value={emoji} onChangeText={setEmoji} style={styles.input} />
      {fieldErrors.emoji ? <HelperText type="error">{fieldErrors.emoji}</HelperText> : null}
      <TextInput mode="outlined" label="Currency" value={currency} onChangeText={setCurrency} style={styles.input} />
      {fieldErrors.currency ? <HelperText type="error">{fieldErrors.currency}</HelperText> : null}

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
