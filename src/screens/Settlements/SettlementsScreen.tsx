import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, Avatar, Chip } from 'react-native-paper';
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
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Settle Up</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Clear your balances</Text>
      </View>

      <Card style={styles.formCard} mode="elevated" elevation={1}>
        <Card.Content>
          <Text style={styles.label}>Select Group</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {groups.map((group) => (
              <Chip
                key={group.id}
                selected={group.id === groupId}
                onPress={() => setGroupId(group.id)}
                style={[styles.chip, group.id === groupId && styles.chipSelected]}
                textStyle={group.id === groupId ? styles.chipTextSelected : styles.chipText}
              >
                {group.name}
              </Chip>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Who is paying?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {members.map((member) => (
                  <Chip
                    key={`from-${member.id}`}
                    selected={member.user.id === fromUserId}
                    onPress={() => setFromUserId(member.user.id)}
                    style={[styles.chip, member.user.id === fromUserId && styles.chipSelected]}
                    textStyle={member.user.id === fromUserId ? styles.chipTextSelected : styles.chipText}
                  >
                    {member.user.name}
                  </Chip>
                ))}
              </ScrollView>
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>To whom?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {members.map((member) => (
                  <Chip
                    key={`to-${member.id}`}
                    selected={member.user.id === toUserId}
                    onPress={() => setToUserId(member.user.id)}
                    style={[styles.chip, member.user.id === toUserId && styles.chipSelected]}
                    textStyle={member.user.id === toUserId ? styles.chipTextSelected : styles.chipText}
                  >
                    {member.user.name}
                  </Chip>
                ))}
              </ScrollView>
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Amount to settle"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            left={<TextInput.Affix text="₹ " />}
            activeOutlineColor={COLORS.primary}
          />

          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={handleCreate} 
              loading={creating} 
              disabled={!amount}
              style={styles.actionButton}
            >
              Cash Settlement
            </Button>
            <Button 
              mode="contained-tonal" 
              icon="cellphone-nfc"
              onPress={handleUpi} 
              loading={initiating} 
              disabled={!amount}
              style={styles.actionButton}
              buttonColor={COLORS.primary + '1A'}
            >
              Pay via UPI
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Settlements</Text>
      
      {settlements.map((item) => (
        <Card key={item.id} style={styles.historyCard} mode="contained">
          <Card.Content>
            <View style={styles.historyHeader}>
              <View style={styles.usersRow}>
                <Avatar.Text size={32} label={(item.fromUser?.name || item.fromUserId).substring(0,2).toUpperCase()} style={styles.avatar} />
                <Avatar.Icon size={24} icon="arrow-right" style={styles.arrowIcon} color={COLORS.muted} />
                <Avatar.Text size={32} label={(item.toUser?.name || item.toUserId).substring(0,2).toUpperCase()} style={styles.avatar} />
              </View>
              <View style={[styles.statusBadge, item.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending]}>
                <Text style={[styles.statusText, item.status === 'COMPLETED' ? styles.statusTextCompleted : styles.statusTextPending]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.historyFooter}>
              <Text style={styles.historyAmount}>{item.currency ?? '₹'} {Number(item.amount).toFixed(2)}</Text>
              {item.status !== 'COMPLETED' && (
                <Button 
                  mode="text" 
                  compact 
                  onPress={() => updateStatus({ id: item.id, status: 'COMPLETED' })}
                  labelStyle={styles.markCompleteText}
                >
                  Mark completed
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
      
      {settlements.length === 0 && (
        <Text style={styles.emptyText}>No settlements recorded yet.</Text>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: COLORS.text, fontWeight: 'bold' },
  subtitle: { color: COLORS.muted, marginTop: 4 },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
  },
  label: { marginTop: 8, marginBottom: 8, color: COLORS.text, fontWeight: '600', fontSize: 13 },
  
  chipScroll: { flexDirection: 'row', marginBottom: 8 },
  chip: { marginRight: 8, backgroundColor: '#f1f3f5', borderRadius: 20 },
  chipSelected: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.text },
  chipTextSelected: { color: '#ffffff', fontWeight: 'bold' },
  
  row: { gap: 16, marginTop: 8 },
  halfWidth: { width: '100%' }, // Depending on preference, this could be flexDirection row if you want them side by side

  input: { marginVertical: 16, backgroundColor: '#ffffff' },
  
  actions: { flexDirection: 'column', gap: 12 },
  actionButton: { borderRadius: 8, paddingVertical: 4 },

  sectionTitle: { fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  
  historyCard: { marginBottom: 12, backgroundColor: '#f8f9fa', borderRadius: 12 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  usersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avatar: { backgroundColor: COLORS.primary + '33' },
  arrowIcon: { backgroundColor: 'transparent' },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusPending: { backgroundColor: '#fff3cd' },
  statusCompleted: { backgroundColor: '#d1e7dd' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextPending: { color: '#856404' },
  statusTextCompleted: { color: '#0f5132' },
  
  historyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyAmount: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  markCompleteText: { color: COLORS.primary, fontWeight: '600' },

  emptyText: { textAlign: 'center', color: COLORS.muted, marginTop: 20 },
});