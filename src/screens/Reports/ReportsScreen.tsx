import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useListExpensesQuery } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';

export const ReportsScreen = () => {
  const { data: expenses = [] } = useListExpensesQuery();

  const totals = expenses.reduce((acc: Record<string, number>, exp) => {
    const key = exp.category || 'OTHER';
    acc[key] = (acc[key] ?? 0) + Number(exp.amount);
    return acc;
  }, {});

  return (
    <Screen scroll>
      <Text variant="headlineSmall" style={styles.title}>Reports</Text>
      {Object.entries(totals).map(([category, amount]) => (
        <Card key={category} style={styles.card}>
          <Card.Content>
            <Text>{category}</Text>
            <Text style={styles.amount}>₹{amount.toFixed(2)}</Text>
          </Card.Content>
        </Card>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  amount: { color: COLORS.primary, fontWeight: '700', marginTop: 6 }
});
