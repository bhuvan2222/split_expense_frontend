import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDeleteExpenseMutation, useGetExpenseQuery } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';

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
      <Text variant="headlineSmall" style={styles.title}>{expense.title}</Text>
      <Text style={styles.subtitle}>{expense.currency} {Number(expense.amount).toFixed(2)}</Text>
      {expense.description ? <Text style={styles.subtitle}>{expense.description}</Text> : null}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Paid by</Text>
          <Text>{expense.paidBy?.name ?? 'Unknown'}</Text>
          <Text style={styles.label}>Split type</Text>
          <Text>{expense.splitType}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Shares</Text>
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
  title: { color: COLORS.primary },
  subtitle: { color: COLORS.muted, marginBottom: 12 },
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  label: { color: COLORS.muted, marginTop: 8 },
  shareRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  amount: { color: COLORS.primary, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 }
});
