import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useAddMemberMutation, useListMembersQuery } from '../../api/groupsApi';
import { useSearchUsersQuery } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';

export const InviteMembersScreen = () => {
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string;
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [addMember, { isLoading }] = useAddMemberMutation();
  const { data: members = [] } = useListMembersQuery({ id: groupId });
  const { data: results = [] } = useSearchUsersQuery({ q: search }, { skip: search.trim().length < 2 });

  const handleInvite = async () => {
    await addMember({ id: groupId, email }).unwrap();
    setEmail('');
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Invite member</Text>
      <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <Button mode="contained" onPress={handleInvite} loading={isLoading} disabled={isLoading || !email.trim()}>
        Send invite
      </Button>

      <Text variant="titleMedium" style={styles.section}>Search users</Text>
      <TextInput mode="outlined" label="Search by name or email" value={search} onChangeText={setSearch} style={styles.input} />
      {results.map((user) => (
        <Text key={user.id} style={styles.member} onPress={() => addMember({ id: groupId, userId: user.id })}>
          {user.name} ({user.email})
        </Text>
      ))}

      <Text variant="titleMedium" style={styles.section}>Current members</Text>
      {members.map((member) => (
        <Text key={member.id} style={styles.member}>{member.user.name} ({member.role})</Text>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  input: { marginBottom: 12 },
  section: { marginTop: 24, marginBottom: 8 },
  member: { marginBottom: 6, color: COLORS.text }
});
