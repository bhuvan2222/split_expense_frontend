import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, Avatar, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useListGroupsQuery, useListMembersQuery } from '../../api/groupsApi';
import { useCreateSettlementMutation, useInitiateUpiMutation, useListSettlementsQuery, useUpdateSettlementStatusMutation } from '../../api/settlementsApi';
import { COLORS } from '../../constants/colors';

type SelectOption = { id: string; label: string; subtitle?: string };

const SearchSelect = ({
  label,
  placeholder,
  value,
  options,
  onSelect
}: {
  label: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  );

  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const selectedLabel = options.find((o) => o.id === value)?.label ?? '';
  const displayValue = open ? query : selectedLabel;

  return (
    <View style={styles.selectWrap}>
      <TextInput
        mode="outlined"
        label={label}
        value={displayValue}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChangeText={(text) => {
          if (!open) setOpen(true);
          setQuery(text);
        }}
        style={styles.selectInput}
        right={<TextInput.Icon icon={open ? 'chevron-up' : 'chevron-down'} />}
      />

      {open ? (
        <View style={styles.inlineList}>
          <ScrollView style={styles.inlineScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {filtered.map((option) => (
              <Button
                key={option.id}
                mode="text"
                onPress={() => {
                  onSelect(option.id);
                  handleClose();
                }}
                style={styles.inlineOption}
                contentStyle={styles.inlineOptionContent}
                labelStyle={styles.inlineOptionText}
              >
                {option.label}
              </Button>
            ))}
            {filtered.length === 0 ? (
              <Text style={styles.inlineEmpty}>No results found.</Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

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

  const summary = useMemo(() => {
    const total = settlements.length;
    const pending = settlements.filter((s) => s.status !== 'COMPLETED');
    const pendingCount = pending.length;
    const completedCount = total - pendingCount;
    const pendingAmount = pending.reduce((acc, s) => acc + Number(s.amount || 0), 0);
    const currency = settlements[0]?.currency ?? '₹';
    return { total, pendingCount, completedCount, pendingAmount, currency };
  }, [settlements]);

  const handleSwap = () => {
    if (!fromUserId || !toUserId) return;
    setFromUserId(toUserId);
    setToUserId(fromUserId);
  };

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
      <Card style={styles.heroCard} mode="contained">
        <View style={styles.heroGlowTop} />
        <View style={styles.heroGlowBottom} />
        <Card.Content>
          <View style={styles.heroHeader}>
            <View>
              <Text variant="headlineSmall" style={styles.heroTitle}>Settle Up</Text>
              <Text variant="bodyMedium" style={styles.heroSubtitle}>Clear balances across your groups</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{summary.completedCount} done</Text>
            </View>
          </View>
          <View style={styles.heroAmountRow}>
            <Text style={styles.heroAmountLabel}>Pending to settle</Text>
            <Text style={styles.heroAmountValue}>{summary.currency} {summary.pendingAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{members.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{summary.total}</Text>
              <Text style={styles.statLabel}>Settlements</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{summary.pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Create settlement</Text>
        <Text style={styles.sectionSubtitle}>Pick a group and set who pays whom</Text>
      </View>

      <Card style={styles.formCard} mode="elevated" elevation={2}>
        <Card.Content>
          <SearchSelect
            label="Select group"
            placeholder="Choose a group"
            value={groupId}
            options={groups.map((group) => ({
              id: group.id,
              label: `${group.emoji ? `${group.emoji} ` : ''}${group.name}`
            }))}
            onSelect={setGroupId}
          />

          <SearchSelect
            label="Who is paying?"
            placeholder="Select payer"
            value={fromUserId}
            options={members.map((member) => ({
              id: member.user.id,
              label: member.user.name
            }))}
            onSelect={setFromUserId}
          />

          <SearchSelect
            label="To whom?"
            placeholder="Select receiver"
            value={toUserId}
            options={members.map((member) => ({
              id: member.user.id,
              label: member.user.name
            }))}
            onSelect={setToUserId}
          />

          <View style={styles.swapRow}>
            <Text style={styles.swapHint}>Swap payer and receiver</Text>
            <IconButton
              icon="swap-vertical"
              mode="contained-tonal"
              size={20}
              onPress={handleSwap}
              style={styles.swapButton}
              iconColor={COLORS.primary}
            />
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

          <View style={styles.presetRow}>
            {['50', '100', '250', '500', '1000'].map((preset) => (
              <Chip
                key={preset}
                compact
                style={styles.presetChip}
                onPress={() => setAmount(preset)}
                textStyle={styles.presetText}
              >
                {preset}
              </Chip>
            ))}
          </View>

          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={handleCreate} 
              loading={creating} 
              disabled={!amount}
              style={styles.actionButton}
            >
              Record Cash
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

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Recent settlements</Text>
        <Text style={styles.sectionSubtitle}>Track progress and mark completed</Text>
      </View>
      
      {settlements.map((item) => (
        <Card key={item.id} style={styles.historyCard} mode="contained">
          <Card.Content>
            <View style={styles.historyHeader}>
              <View style={styles.usersRow}>
                <Avatar.Text size={36} label={(item.fromUser?.name || item.fromUserId).substring(0,2).toUpperCase()} style={styles.avatar} />
                <View style={styles.flowLine} />
                <Avatar.Text size={36} label={(item.toUser?.name || item.toUserId).substring(0,2).toUpperCase()} style={styles.avatar} />
              </View>
              <View style={[styles.statusBadge, item.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending]}>
                <Text style={[styles.statusText, item.status === 'COMPLETED' ? styles.statusTextCompleted : styles.statusTextPending]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.historyDetails}>
              <Text style={styles.historyNames}>{item.fromUser?.name || 'Member'} paid {item.toUser?.name || 'Member'}</Text>
              <Text style={styles.historyAmount}>{item.currency ?? '₹'} {Number(item.amount).toFixed(2)}</Text>
            </View>

            {item.status !== 'COMPLETED' && (
              <Button 
                mode="contained-tonal" 
                compact 
                onPress={() => updateStatus({ id: item.id, status: 'COMPLETED' })}
                labelStyle={styles.markCompleteText}
                style={styles.markButton}
              >
                Mark completed
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}
      
      {settlements.length === 0 && (
        <Card style={styles.emptyCard} mode="outlined">
          <Card.Content>
            <Text style={styles.emptyTitle}>No settlements yet</Text>
            <Text style={styles.emptyText}>Create one above to keep your group balanced and in sync.</Text>
          </Card.Content>
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 0,
    marginBottom: 20,
    overflow: 'hidden',
    marginHorizontal: -20,
  },
  heroGlowTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#22c55e',
    opacity: 0.18,
    top: -80,
    right: -40,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#38bdf8',
    opacity: 0.16,
    bottom: -140,
    left: -60,
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroTitle: { color: '#ffffff', fontWeight: '700' },
  heroSubtitle: { color: '#cbd5f5', marginTop: 4 },
  heroBadge: { backgroundColor: '#1f2937', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  heroBadgeText: { color: '#93c5fd', fontSize: 12, fontWeight: '700' },
  heroAmountRow: { marginTop: 8 },
  heroAmountLabel: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  heroAmountValue: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginTop: 4 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statPill: { backgroundColor: '#111f2b', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, flex: 1 },
  statValue: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    marginBottom: 24,
    marginHorizontal: -20,
  },
  label: { marginTop: 8, marginBottom: 8, color: COLORS.text, fontWeight: '600', fontSize: 13 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontWeight: '700', color: COLORS.text },
  sectionSubtitle: { color: COLORS.muted, marginTop: 4 },
  
  selectWrap: { marginBottom: 12 },
  selectInput: { backgroundColor: '#ffffff' },
  inlineList: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    marginTop: 6,
    maxHeight: 220
  },
  inlineScroll: { paddingVertical: 4 },
  inlineOption: { alignSelf: 'stretch' },
  inlineOptionContent: { justifyContent: 'flex-start' },
  inlineOptionText: { color: COLORS.text, textAlign: 'left' },
  inlineEmpty: { color: COLORS.muted, textAlign: 'center', paddingVertical: 12 },

  swapRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  swapHint: { color: COLORS.muted, fontSize: 12 },
  swapButton: { margin: 0, backgroundColor: COLORS.primary + '1A' },

  input: { marginVertical: 16, backgroundColor: '#ffffff' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  presetChip: { backgroundColor: '#eef2ff', borderRadius: 999 },
  presetText: { color: '#3730a3', fontWeight: '600' },
  
  actions: { flexDirection: 'column', gap: 12 },
  actionButton: { borderRadius: 10, paddingVertical: 6 },
  
  historyCard: { marginBottom: 12, backgroundColor: '#f8fafc', borderRadius: 0, marginHorizontal: -20 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  usersRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { backgroundColor: COLORS.primary + '33' },
  flowLine: { width: 22, height: 2, backgroundColor: COLORS.primary + '55', borderRadius: 999 },
  
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusPending: { backgroundColor: '#fff3cd' },
  statusCompleted: { backgroundColor: '#d1e7dd' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextPending: { color: '#856404' },
  statusTextCompleted: { color: '#0f5132' },
  
  historyDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyNames: { color: COLORS.muted, fontSize: 12 },
  historyAmount: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  markCompleteText: { color: COLORS.primary, fontWeight: '600' },
  markButton: { alignSelf: 'flex-start', marginTop: 10 },

  emptyCard: { borderRadius: 0, borderColor: '#e2e8f0', backgroundColor: '#ffffff', marginHorizontal: -20 },
  emptyTitle: { fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  emptyText: { color: COLORS.muted },
});
