import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, SegmentedButtons, Switch, Text, TextInput } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useGetGroupQuery, useUpdateGroupMutation } from '../../api/groupsApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

const GROUP_TYPES = [
  { value: 'TRIP', label: 'Trip' },
  { value: 'ROOMMATES', label: 'Roommates' },
  { value: 'COUPLE', label: 'Couple' },
  { value: 'FRIENDS', label: 'Friends' },
  { value: 'WORK', label: 'Work' },
  { value: 'OTHER', label: 'Other' }
];

export const EditGroupScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const groupId = route.params?.groupId as string;
  const { data: group, isLoading } = useGetGroupQuery({ id: groupId });
  const [updateGroup, { isLoading: saving }] = useUpdateGroupMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [type, setType] = useState('OTHER');
  const [simplifyDebts, setSimplifyDebts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!group) return;
    setName(group.name ?? '');
    setDescription(group.description ?? '');
    setEmoji(group.emoji ?? '');
    setCurrency(group.currency ?? 'INR');
    setType(group.type ?? 'OTHER');
    setSimplifyDebts(group.simplifyDebts ?? true);
  }, [group]);

  const handleSave = async () => {
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Group name is required.');
      return;
    }

    const body: Record<string, unknown> = {
      name: trimmed,
      simplifyDebts
    };

    if (description.trim()) body.description = description.trim();
    if (emoji.trim()) body.emoji = emoji.trim();
    if (currency.trim()) body.currency = currency.trim();
    if (type) body.type = type;

    try {
      await updateGroup({ id: groupId, body }).unwrap();
      navigation.goBack();
    } catch (err: any) {
      const message = err?.data?.error?.message || 'Failed to update group';
      setError(message);
    }
  };

  if (isLoading || !group) {
    return (
      <Screen>
        <LoadingSpinner />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <HeroHeader title="Edit group" subtitle="Update details and preferences" icon="pencil" />

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput mode="outlined" label="Emoji" value={emoji} onChangeText={setEmoji} style={styles.input} />
          <TextInput mode="outlined" label="Currency" value={currency} onChangeText={setCurrency} style={styles.input} />

          <Text style={styles.label}>Type</Text>
          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={GROUP_TYPES}
            style={styles.segmented}
          />

          <View style={styles.toggleRow}>
            <Text style={styles.label}>Simplify debts</Text>
            <Switch value={simplifyDebts} onValueChange={setSimplifyDebts} />
          </View>

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.primaryButton}>
            Save changes
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  label: { color: COLORS.text, marginTop: 8, marginBottom: 6, fontWeight: '600' },
  segmented: { marginBottom: 12 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  primaryButton: { marginTop: 8 }
});
