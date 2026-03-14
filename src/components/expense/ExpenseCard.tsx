import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import type { Expense } from '../../api/expensesApi';
import { format } from 'date-fns';

export const ExpenseCard = ({ expense, onPress }: { expense: Expense; onPress?: () => void }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content>
      <View style={styles.row}>
        <Text variant="titleMedium">{expense.title}</Text>
        <Text style={styles.amount}>{expense.currency} {Number(expense.amount).toFixed(2)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Paid by {expense.paidBy?.name ?? 'Unknown'}</Text>
        <Text style={styles.meta}>{format(new Date(expense.date), 'dd MMM yyyy')}</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { color: COLORS.primary, fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  meta: { color: COLORS.muted, fontSize: 12 }
});
