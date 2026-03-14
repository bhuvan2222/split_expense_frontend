import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useListGroupsQuery } from '../../api/groupsApi';
import { useListExpensesQuery } from '../../api/expensesApi';
import { useListSettlementsQuery } from '../../api/settlementsApi';
import { COLORS } from '../../constants/colors';

export const HomeScreen = () => {
  const { data: groups = [] } = useListGroupsQuery();
  const { data: expenses = [] } = useListExpensesQuery();
  const { data: settlements = [] } = useListSettlementsQuery();

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return (
    <Screen scroll>
      <Text variant="headlineMedium" style={styles.title}>Overview</Text>

      <View style={styles.grid}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metric}>{groups.length}</Text>
            <Text style={styles.label}>Groups</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metric}>{expenses.length}</Text>
            <Text style={styles.label}>Expenses</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.cardWide}>
        <Card.Content>
          <Text style={styles.metric}>{totalSpent.toFixed(2)} INR</Text>
          <Text style={styles.label}>Total spent</Text>
        </Card.Content>
      </Card>

      <Card style={styles.cardWide}>
        <Card.Content>
          <Text style={styles.metric}>{settlements.length}</Text>
          <Text style={styles.label}>Settlements</Text>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: 16, color: COLORS.primary },
  grid: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, backgroundColor: '#ffffff' },
  cardWide: { marginTop: 12, backgroundColor: '#ffffff' },
  metric: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  label: { color: COLORS.muted, marginTop: 4 }
});
