import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, Menu, Text, TextInput, SegmentedButtons } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useAddMemberMutation, useCreateGroupMutation, useListGroupsQuery, useListMembersQuery } from '../../api/groupsApi';
import { useCreateExpenseMutation } from '../../api/expensesApi';
import { useSearchUsersQuery } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { HeroHeader } from '../../components/common/HeroHeader';

export const AddExpenseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialGroupId = route.params?.groupId as string | undefined;
  const { user } = useAuth();

  const { data: groups = [] } = useListGroupsQuery();
  const [groupId, setGroupId] = useState<string | undefined>(initialGroupId);
  const [mode, setMode] = useState<'GROUP' | 'QUICK'>('GROUP');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string | undefined>(undefined);
  const [paidByMenuVisible, setPaidByMenuVisible] = useState(false);
  const [splitType, setSplitType] = useState<'EQUAL' | 'UNEQUAL' | 'PERCENTAGE' | 'SHARES'>('EQUAL');
  const [splitValues, setSplitValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [error, setError] = useState('');

  const { data: members = [] } = useListMembersQuery({ id: groupId ?? '' }, { skip: !groupId || mode !== 'GROUP' });
  const { data: results = [] } = useSearchUsersQuery({ q: search }, { skip: search.trim().length < 2 });
  const [createGroup, { isLoading: creatingGroup }] = useCreateGroupMutation();
  const [addMember, { isLoading: addingMember }] = useAddMemberMutation();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  useEffect(() => {
    if (!groupId && groups.length > 0) {
      setGroupId(groups[0].id);
    }
  }, [groupId, groups]);

  useEffect(() => {
    if (mode === 'GROUP' && members.length > 0 && !paidById) {
      setPaidById(members[0].user.id);
    }
  }, [members, paidById, mode]);

  useEffect(() => {
    if (mode === 'QUICK' && user?.id && !paidById) {
      setPaidById(user.id);
    }
  }, [mode, paidById, user?.id]);

  const quickParticipants = useMemo(() => {
    const list = selectedUsers.filter((u) => u.id !== user?.id);
    if (user?.id && user.name && user.email) {
      return [{ id: user.id, name: user.name, email: user.email }, ...list];
    }
    return list;
  }, [selectedUsers, user?.id, user?.name, user?.email]);

  const splitsPayload = useMemo(() => {
    if (splitType === 'EQUAL') return undefined;
    return members.map((member) => {
      const rawValue = splitValues[member.user.id] ?? '';
      const numeric = Number(rawValue || 0);
      if (splitType === 'PERCENTAGE') {
        return { userId: member.user.id, percentage: numeric };
      }
      if (splitType === 'SHARES') {
        return { userId: member.user.id, shares: Math.max(1, Math.floor(numeric || 1)) };
      }
      return { userId: member.user.id, amount: numeric };
    });
  }, [splitType, splitValues, members]);

  const quickSplitsPayload = useMemo(() => {
    if (splitType === 'EQUAL') return undefined;
    return quickParticipants.map((participant) => {
      const rawValue = splitValues[participant.id] ?? '';
      const numeric = Number(rawValue || 0);
      if (splitType === 'PERCENTAGE') {
        return { userId: participant.id, percentage: numeric };
      }
      if (splitType === 'SHARES') {
        return { userId: participant.id, shares: Math.max(1, Math.floor(numeric || 1)) };
      }
      return { userId: participant.id, amount: numeric };
    });
  }, [splitType, splitValues, quickParticipants]);

  const handleSubmit = async () => {
    setError('');
    if (!groupId) return;
    const payload: any = {
      groupId,
      title,
      description,
      amount: Number(amount),
      paidById,
      splitType
    };
    if (splitsPayload) {
      payload.shares = splitsPayload;
    }
    const result = await createExpense(payload).unwrap();
    navigation.navigate('ExpenseDetail', { expenseId: result.id });
  };

  const handleQuickSplit = async () => {
    setError('');
    if (!user?.id) {
      setError('You must be signed in.');
      return;
    }
    if (!title || !amount) {
      setError('Title and amount are required.');
      return;
    }
    if (selectedUsers.length === 0) {
      setError('Add at least one person to split with.');
      return;
    }
    try {
      const creatorName = user?.name ?? 'You';
      const names = selectedUsers.map((u) => u.name).slice(0, 3);
      const suffix = selectedUsers.length > 3 ? ` +${selectedUsers.length - 3}` : '';
      const groupName = `${creatorName} + ${names.join(' + ')}${suffix}`;

      const group = await createGroup({ name: groupName, type: 'FRIENDS' }).unwrap();

      await Promise.all(selectedUsers.map((u) => addMember({ id: group.id, userId: u.id }).unwrap()));

      const payload: any = {
        groupId: group.id,
        title,
        description,
        amount: Number(amount),
        paidById: paidById ?? user.id,
        splitType
      };

      if (quickSplitsPayload) {
        payload.shares = quickSplitsPayload;
      }

      const result = await createExpense(payload).unwrap();
      navigation.navigate('ExpenseDetail', { expenseId: result.id });
    } catch (err: any) {
      const message = err?.data?.error?.message || 'Failed to create quick split';
      setError(message);
    }
  };

  return (
    <Screen scroll>
      <HeroHeader title="Add expense" subtitle="Split fairly and keep everyone in sync" icon="receipt" />

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <Text style={styles.label}>Mode</Text>
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as any)}
            buttons={[
              { value: 'GROUP', label: 'Group' },
              { value: 'QUICK', label: 'Quick split' }
            ]}
            style={styles.segmented}
          />

          {mode === 'GROUP' ? (
            <>
              <Text style={styles.label}>Group</Text>
              <View style={styles.choiceRow}>
                {groups.map((group) => (
                  <Button
                    key={group.id}
                    mode={group.id === groupId ? 'contained' : 'outlined'}
                    onPress={() => setGroupId(group.id)}
                    style={styles.choiceButton}
                  >
                    {group.emoji ? `${group.emoji} ` : ''}{group.name}
                  </Button>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>People</Text>
              <TextInput
                mode="outlined"
                label="Search by name or email"
                value={search}
                onChangeText={setSearch}
                style={styles.input}
              />
              {results
                .filter((u) => u.id !== user?.id)
                .map((u) => {
                  const already = selectedUsers.some((s) => s.id === u.id);
                  return (
                    <Button
                      key={u.id}
                      mode={already ? 'contained' : 'outlined'}
                      onPress={() => {
                        if (already) {
                          setSelectedUsers((prev) => prev.filter((s) => s.id !== u.id));
                        } else {
                          setSelectedUsers((prev) => [...prev, { id: u.id, name: u.name, email: u.email }]);
                        }
                      }}
                      style={styles.choiceButton}
                    >
                      {u.name} ({u.email})
                    </Button>
                  );
                })}

              {quickParticipants.length > 0 ? (
                <View style={styles.selectedList}>
                  <Text style={styles.muted}>Selected:</Text>
                  {quickParticipants.map((u) => (
                    <Text key={u.id} style={styles.selectedItem}>{u.name}</Text>
                  ))}
                </View>
              ) : null}
            </>
          )}

          <TextInput mode="outlined" label="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput
            mode="outlined"
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {mode === 'GROUP' ? (
            <>
              <Text style={styles.label}>Paid by</Text>
              <Menu
                visible={paidByMenuVisible}
                onDismiss={() => setPaidByMenuVisible(false)}
                anchor={
                  <Button mode="outlined" onPress={() => setPaidByMenuVisible(true)} style={styles.choiceButton}>
                    {members.find((m) => m.user.id === paidById)?.user.name ?? 'Select member'}
                  </Button>
                }
              >
                {members.map((member) => (
                  <Menu.Item
                    key={member.id}
                    onPress={() => {
                      setPaidById(member.user.id);
                      setPaidByMenuVisible(false);
                    }}
                    title={member.user.name}
                  />
                ))}
              </Menu>
            </>
          ) : (
            <>
              <Text style={styles.label}>Paid by</Text>
              <Menu
                visible={paidByMenuVisible}
                onDismiss={() => setPaidByMenuVisible(false)}
                anchor={
                  <Button mode="outlined" onPress={() => setPaidByMenuVisible(true)} style={styles.choiceButton}>
                    {quickParticipants.find((p) => p.id === paidById)?.name ?? 'Select payer'}
                  </Button>
                }
              >
                {quickParticipants.map((participant) => (
                  <Menu.Item
                    key={participant.id}
                    onPress={() => {
                      setPaidById(participant.id);
                      setPaidByMenuVisible(false);
                    }}
                    title={participant.name}
                  />
                ))}
              </Menu>
            </>
          )}

          <Text style={styles.label}>Split type</Text>
          <SegmentedButtons
            value={splitType}
            onValueChange={(value) => setSplitType(value as any)}
            buttons={[
              { value: 'EQUAL', label: 'Equal' },
              { value: 'UNEQUAL', label: 'Unequal' },
              { value: 'PERCENTAGE', label: '%' },
              { value: 'SHARES', label: 'Shares' }
            ]}
            style={styles.segmented}
          />

          {splitType !== 'EQUAL' ? (
            <View style={styles.splitList}>
              {(mode === 'GROUP' ? members.map((m) => ({ id: m.user.id, name: m.user.name })) : quickParticipants).map((person) => (
                <TextInput
                  key={person.id}
                  mode="outlined"
                  label={`${person.name} ${splitType === 'PERCENTAGE' ? '(%)' : splitType === 'SHARES' ? '(shares)' : '(amount)'}`}
                  value={splitValues[person.id] ?? ''}
                  onChangeText={(value) => setSplitValues((prev) => ({ ...prev, [person.id]: value }))}
                  keyboardType="numeric"
                  style={styles.input}
                />
              ))}
            </View>
          ) : null}

          {mode === 'GROUP' ? (
            <Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading || !title || !amount} style={styles.primaryButton}>
              Save expense
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleQuickSplit}
              loading={isLoading || creatingGroup || addingMember}
              disabled={isLoading || creatingGroup || addingMember}
              style={styles.primaryButton}
            >
              Create quick split
            </Button>
          )}

          {error ? <HelperText type="error">{error}</HelperText> : null}
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  label: { marginTop: 12, marginBottom: 6, color: COLORS.text, fontWeight: '600' },
  segmented: { marginBottom: 12 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceButton: { marginBottom: 6, borderRadius: 10 },
  splitList: { marginTop: 8 },
  selectedList: { marginVertical: 8 },
  selectedItem: { color: COLORS.text, marginBottom: 4 },
  muted: { color: COLORS.muted, marginBottom: 12 },
  primaryButton: { marginTop: 8 }
});
