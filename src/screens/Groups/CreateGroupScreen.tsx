import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
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

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleSubmit = async () => {
    const result = await createGroup({ name, description, currency, emoji }).unwrap();
    navigation.navigate('GroupDetail', { groupId: result.id });
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Create group</Text>
      <TextInput mode="outlined" label="Group name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput mode="outlined" label="Emoji" value={emoji} onChangeText={setEmoji} style={styles.input} />
      <TextInput mode="outlined" label="Currency" value={currency} onChangeText={setCurrency} style={styles.input} />

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
