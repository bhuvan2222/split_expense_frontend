import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  useGetGroupQuery,
  useGetBalancesQuery,
  useInviteLinkQuery,
  useLazyExportCsvQuery,
  useLazyExportPdfQuery
} from '../../api/groupsApi';
import { useListExpensesQuery } from '../../api/expensesApi';
import { BalanceSummary } from '../../components/group/BalanceSummary';
import { ExpenseCard } from '../../components/expense/ExpenseCard';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';

export const GroupDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string;

  const { data: group, isLoading } = useGetGroupQuery({ id: groupId });
  const { data: balances } = useGetBalancesQuery({ id: groupId });
  const { data: invite } = useInviteLinkQuery({ id: groupId });
  const { data: expenses = [] } = useListExpensesQuery({ groupId });
  const [exportCsv] = useLazyExportCsvQuery();
  const [exportPdf] = useLazyExportPdfQuery();

  if (isLoading || !group) {
    return (
      <Screen>
        <LoadingSpinner />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <HeroHeader
        title={`${group.emoji ? `${group.emoji} ` : ''}${group.name}`}
        subtitle={group.description || 'Shared expenses overview'}
        icon="account-group"
        badge={group.currency ?? 'INR'}
      />

      <SectionHeader title="Quick actions" subtitle="Add, edit, invite, or export" />
      <Card style={styles.actionCard} mode="contained">
        <Card.Content style={styles.actionContent}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense', params: { groupId } })}
            style={styles.primaryAction}
          >
            Add expense
          </Button>
          <View style={styles.actionRow}>
            <Button mode="outlined" onPress={() => navigation.navigate('EditGroup', { groupId })}>
              Edit
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('InviteMembers', { groupId })}>Invite</Button>
          </View>
          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              onPress={async () => {
                try {
                  const csv = await exportCsv({ id: groupId }).unwrap();
                  Alert.alert('CSV export', `Exported ${csv.length} characters`);
                } catch (err: any) {
                  Alert.alert('CSV export failed', err?.data?.error?.message ?? 'Premium required');
                }
              }}
            >
              Export CSV
            </Button>
            <Button
              mode="outlined"
              onPress={async () => {
                try {
                  const pdf = await exportPdf({ id: groupId }).unwrap();
                  Alert.alert('PDF export', `Exported ${pdf.length} characters`);
                } catch (err: any) {
                  Alert.alert('PDF export failed', err?.data?.error?.message ?? 'Premium required');
                }
              }}
            >
              Export PDF
            </Button>
          </View>
        </Card.Content>
      </Card>

      {invite?.inviteCode ? (
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.muted}>Invite code</Text>
            <Text>{invite.inviteCode}</Text>
            {invite.webLink ? <Text style={styles.link}>{invite.webLink}</Text> : null}
          </Card.Content>
        </Card>
      ) : null}

      {group.members ? (
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text variant="titleMedium">Members</Text>
            {group.members.map((member) => (
              <Text key={member.id} style={styles.muted}>
                {member.user.name} • {member.role}
              </Text>
            ))}
          </Card.Content>
        </Card>
      ) : null}

      <BalanceSummary balances={balances?.balances ?? []} />

      <SectionHeader title="Recent expenses" subtitle="Latest activity in this group" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleMedium">Recent expenses</Text>
        </Card.Content>
      </Card>

      {expenses.slice(0, 8).map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}
        />
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  actionCard: { borderRadius: 0, backgroundColor: '#ffffff', marginBottom: 16, marginHorizontal: -20 },
  actionContent: { gap: 12 },
  primaryAction: { borderRadius: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  card: { marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 0, marginHorizontal: -20 },
  muted: { color: COLORS.muted },
  link: { color: COLORS.primary, marginTop: 6 }
});
