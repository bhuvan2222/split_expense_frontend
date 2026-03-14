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
      <Text variant="headlineSmall" style={styles.title}>
        {group.emoji ? `${group.emoji} ` : ''}{group.name}
      </Text>
      {group.description ? <Text style={styles.subtitle}>{group.description}</Text> : null}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense', params: { groupId } })}
        >
          Add expense
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('EditGroup', { groupId })}>
          Edit
        </Button>
        <Button mode="outlined" onPress={() => navigation.navigate('InviteMembers', { groupId })}>Invite</Button>
      </View>
      <View style={styles.actions}>
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

      {invite?.inviteCode ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.muted}>Invite code</Text>
            <Text>{invite.inviteCode}</Text>
            {invite.webLink ? <Text style={styles.link}>{invite.webLink}</Text> : null}
          </Card.Content>
        </Card>
      ) : null}

      {group.members ? (
        <Card style={styles.card}>
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

      <Card style={styles.card}>
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
  title: { color: COLORS.primary },
  subtitle: { color: COLORS.muted, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  muted: { color: COLORS.muted },
  link: { color: COLORS.primary, marginTop: 6 }
});
