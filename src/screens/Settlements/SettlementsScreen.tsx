import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useListGroupsQuery, useListMembersQuery } from '../../api/groupsApi';
import { useCreateSettlementMutation, useInitiateUpiMutation, useListSettlementsQuery, useUpdateSettlementStatusMutation } from '../../api/settlementsApi';
import { COLORS } from '../../constants/colors';

export const SettlementsScreen = () => {
  const navigation = useNavigation<any>();
  const { data: groups = [] } = useListGroupsQuery();
  const [groupId, setGroupId] = useState<string | undefined>(undefined);
  const { data: members = [] } = useListMembersQuery({ id: groupId ?? '' }, { skip: !groupId });
  const { data: settlements = [] } = useListSettlementsQuery(groupId ? { groupId } : undefined);

  const [fromUserId, setFromUserId] = useState<string | undefined>(undefined);
  const [toUserId, setToUserId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState('');

  const [createSettlement, { isLoading: creating }] = useCreateSettlementMutation();
  const [initiateUpi, { isLoading: initiating }] = useInitiateUpiMutation();
  const [updateStatus] = useUpdateSettlementStatusMutation();

  useEffect(() => {
    if (!groupId && groups.length > 0) {
      setGroupId(groups[0].id);
    }
  }, [groupId, groups]);

  useEffect(() => {
    if (members.length > 1 && (!fromUserId || !toUserId)) {
      setFromUserId(members[0].user.id);
      setToUserId(members[1].user.id);
    }
  }, [members, fromUserId, toUserId]);

  const handleCreate = async () => {
    if (!groupId || !fromUserId || !toUserId) return;
    await createSettlement({ groupId, fromUserId, toUserId, amount: Number(amount), method: 'CASH' }).unwrap();
    setAmount('');
  };

  const handleUpi = async () => {
    if (!groupId || !fromUserId || !toUserId) return;
    const result = await initiateUpi({ groupId, fromUserId, toUserId, amount: Number(amount) }).unwrap();
    navigation.navigate('UpiPay', { settlementId: result.settlement.id, upiIntent: result.upiIntent });
  };

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Settlements</Text>

      <Text style={styles.label}>Group</Text>
      <View style={styles.choiceRow}>
        {groups.map((group) => (
          <Button
            key={group.id}
            mode={group.id === groupId ? 'contained' : 'outlined'}
            onPress={() => setGroupId(group.id)}
            style={styles.choiceButton}
          >
            {group.name}
          </Button>
        ))}
      </View>

      <Text style={styles.label}>From</Text>
      <View style={styles.choiceRow}>
        {members.map((member) => (
          <Button
            key={member.id}
            mode={member.user.id === fromUserId ? 'contained' : 'outlined'}
            onPress={() => setFromUserId(member.user.id)}
            style={styles.choiceButton}
          >
            {member.user.name}
          </Button>
        ))}
      </View>

      <Text style={styles.label}>To</Text>
      <View style={styles.choiceRow}>
        {members.map((member) => (
          <Button
            key={member.id}
            mode={member.user.id === toUserId ? 'contained' : 'outlined'}
            onPress={() => setToUserId(member.user.id)}
            style={styles.choiceButton}
          >
            {member.user.name}
          </Button>
        ))}
      </View>

      <TextInput
        mode="outlined"
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.actions}>
        <Button mode="contained" onPress={handleCreate} loading={creating} disabled={!amount}>
          Mark as settled
        </Button>
        <Button mode="outlined" onPress={handleUpi} loading={initiating} disabled={!amount}>
          Pay via UPI
        </Button>
      </View>

      <Text variant="titleMedium" style={styles.section}>History</Text>
      {settlements.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Content>
            <Text>{item.fromUser?.name ?? item.fromUserId} → {item.toUser?.name ?? item.toUserId}</Text>
            <Text style={styles.muted}>{item.currency} {Number(item.amount).toFixed(2)} • {item.status}</Text>
            {item.status !== 'COMPLETED' ? (
              <Button mode="text" onPress={() => updateStatus({ id: item.id, status: 'COMPLETED' })}>
                Mark completed
              </Button>
            ) : null}
          </Card.Content>
        </Card>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 6, color: COLORS.text },
  input: { marginVertical: 12 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  section: { marginVertical: 12 },
  card: { marginBottom: 10, backgroundColor: '#ffffff' },
  muted: { color: COLORS.muted },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choiceButton: { marginBottom: 6 }
});
