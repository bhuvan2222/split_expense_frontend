import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import type { Expense } from '../../api/expensesApi';
import { format } from 'date-fns';

export const ExpenseCard = ({ expense, onPress }: { expense: Expense; onPress?: () => void }) => (
  <Card style={styles.card} onPress={onPress} mode="contained">
    <Card.Content>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text variant="titleMedium" style={styles.title}>{expense.title}</Text>
          <Text style={styles.meta}>Paid by {expense.paidBy?.name ?? 'Unknown'}</Text>
        </View>
        <View style={styles.amountPill}>
          <Text style={styles.amount}>{expense.currency} {Number(expense.amount).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{format(new Date(expense.date), 'dd MMM yyyy')}</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 0, marginHorizontal: -20, width: '100%', alignSelf: 'stretch' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleBlock: { flex: 1, paddingRight: 10 },
  title: { color: COLORS.text, fontWeight: '700' },
  amountPill: { backgroundColor: COLORS.primary + '14', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  amount: { color: COLORS.primary, fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  meta: { color: COLORS.muted, fontSize: 12 }
});
