import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDeleteExpenseMutation, useGetExpenseQuery } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';

export const ExpenseDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const expenseId = route.params?.expenseId as string;

  const { data: expense, isLoading } = useGetExpenseQuery({ id: expenseId });
  const [deleteExpense, { isLoading: deleting }] = useDeleteExpenseMutation();

  if (isLoading || !expense) {
    return (
      <Screen>
        <LoadingSpinner />
      </Screen>
    );
  }

  const handleDelete = async () => {
    await deleteExpense({ id: expenseId }).unwrap();
    navigation.goBack();
  };

  return (
    <Screen scroll>
      <HeroHeader
        title={expense.title}
        subtitle={expense.description || 'Expense details and splits'}
        icon="receipt"
        badge={expense.currency}
      >
        <View style={styles.heroAmountRow}>
          <Text style={styles.heroAmountLabel}>Total amount</Text>
          <Text style={styles.heroAmountValue}>{expense.currency} {Number(expense.amount).toFixed(2)}</Text>
        </View>
      </HeroHeader>

      <SectionHeader title="Payment info" subtitle="Who paid and how it was split" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text style={styles.label}>Paid by</Text>
          <Text>{expense.paidBy?.name ?? 'Unknown'}</Text>
          <Text style={styles.label}>Split type</Text>
          <Text>{expense.splitType}</Text>
        </Card.Content>
      </Card>

      <SectionHeader title="Shares" subtitle="Breakdown per member" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          {expense.shares?.map((share) => (
            <View key={share.id} style={styles.shareRow}>
              <Text>{share.userId}</Text>
              <Text style={styles.amount}>₹{Number(share.amount).toFixed(2)}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button mode="outlined" onPress={() => navigation.navigate('EditExpense', { expenseId })}>Edit</Button>
        <Button mode="contained" buttonColor={COLORS.danger} onPress={handleDelete} loading={deleting}>
          Delete
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroAmountRow: { marginTop: 6 },
  heroAmountLabel: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  heroAmountValue: { color: '#ffffff', fontSize: 26, fontWeight: '700', marginTop: 4 },
  card: { marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 0, marginHorizontal: -20 },
  label: { color: COLORS.muted, marginTop: 8 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  amount: { color: COLORS.primary, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 }
});
