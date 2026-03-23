import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useAddMemberMutation, useListMembersQuery } from '../../api/groupsApi';
import { useSearchUsersQuery } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';

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
      <HeroHeader title="Invite member" subtitle="Grow your group in seconds" icon="account-plus" />

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <Button mode="contained" onPress={handleInvite} loading={isLoading} disabled={isLoading || !email.trim()}>
            Send invite
          </Button>
        </Card.Content>
      </Card>

      <SectionHeader title="Search users" subtitle="Tap a user to invite instantly" />
      <Card style={styles.searchCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Search by name or email" value={search} onChangeText={setSearch} style={styles.input} />
          <View style={styles.chipRow}>
            {results.map((user) => (
              <Chip
                key={user.id}
                style={styles.userChip}
                textStyle={styles.userChipText}
                onPress={() => addMember({ id: groupId, userId: user.id })}
              >
                {user.name}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <SectionHeader title="Current members" subtitle={`${members.length} people in this group`} />
      <View style={styles.memberList}>
        {members.map((member) => (
          <Chip key={member.id} style={styles.memberChip} textStyle={styles.memberText}>
            {member.user.name} · {member.role}
          </Chip>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginBottom: 16, marginHorizontal: -20 },
  searchCard: { borderRadius: 0, backgroundColor: '#ffffff', marginBottom: 16, marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  userChip: { backgroundColor: COLORS.primary + '12' },
  userChipText: { color: COLORS.primary, fontWeight: '600' },
  memberList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  memberChip: { backgroundColor: '#eef2ff' },
  memberText: { color: '#3730a3', fontWeight: '600' }
});
