import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, HelperText, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useCreateGroupMutation } from '../../api/groupsApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const CreateGroupScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string; currency?: string }>({});

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFieldErrors({ name: 'Group name is required.' });
      return;
    }
    const payload: { name: string; description?: string; currency?: string } = { name: trimmedName };
    if (description.trim()) payload.description = description.trim();
    if (currency.trim()) payload.currency = currency.trim();

    try {
      const result = await createGroup(payload).unwrap();
      navigation.navigate('GroupDetail', { groupId: result.id });
    } catch (err: any) {
      const fields = err?.data?.error?.fields;
      if (Array.isArray(fields) && fields.length > 0) {
        const next: { name?: string; description?: string; currency?: string } = {};
        fields.forEach((f: { field?: string; message?: string }) => {
          if (!f?.field || !f?.message) return;
          if (f.field === 'name') next.name = f.message;
          if (f.field === 'description') next.description = f.message;
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
      <HeroHeader title="Create group" subtitle="Start a shared space for expenses" icon="account-multiple-plus" />

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} style={styles.input} />
          {fieldErrors.name ? <HelperText type="error">{fieldErrors.name}</HelperText> : null}
          <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
          {fieldErrors.description ? <HelperText type="error">{fieldErrors.description}</HelperText> : null}
          <TextInput mode="outlined" label="Currency" value={currency} onChangeText={setCurrency} style={styles.input} />
          {fieldErrors.currency ? <HelperText type="error">{fieldErrors.currency}</HelperText> : null}

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading || !name.trim()} style={styles.primaryButton}>
            Create
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  primaryButton: { marginTop: 8 }
});
