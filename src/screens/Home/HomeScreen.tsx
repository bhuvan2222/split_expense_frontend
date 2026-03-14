import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
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
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Here is your expense summary</Text>
      </View>

      {/* Prominent Hero Card for Total Spent */}
      <Card style={styles.heroCard} mode="elevated" elevation={3}>
        <Card.Content style={styles.heroContent}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroLabel}>Total Spent</Text>
            <Text style={styles.heroMetric}>{totalSpent.toFixed(2)} <Text style={styles.heroCurrency}>INR</Text></Text>
          </View>
          <Avatar.Icon size={56} icon="wallet" style={styles.heroIcon} color={COLORS.primary} />
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>Quick Stats</Text>

      <View style={styles.grid}>
        <Card style={styles.statCard} mode="contained">
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={40} icon="account-group" style={styles.statIcon} color={COLORS.secondary} />
            <Text style={styles.metric}>{groups.length}</Text>
            <Text style={styles.label}>Groups</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="contained">
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={40} icon="receipt" style={styles.statIcon} color={COLORS.secondary} />
            <Text style={styles.metric}>{expenses.length}</Text>
            <Text style={styles.label}>Expenses</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="contained">
          <Card.Content style={styles.statContent}>
            <Avatar.Icon size={40} icon="handshake" style={styles.statIcon} color={COLORS.secondary} />
            <Text style={styles.metric}>{settlements.length}</Text>
            <Text style={styles.label}>Settlements</Text>
          </Card.Content>
        </Card>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: COLORS.text, fontWeight: 'bold' },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  
  heroCard: { 
    marginBottom: 24, 
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  heroTextContainer: { flex: 1 },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  heroMetric: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  heroCurrency: { fontSize: 18, fontWeight: 'normal', color: 'rgba(255,255,255,0.8)' },
  heroIcon: { backgroundColor: 'rgba(255,255,255,0.2)' },

  sectionTitle: { marginBottom: 12, fontWeight: '600', color: COLORS.text },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { 
    flex: 1, 
    minWidth: '30%', 
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  statContent: { alignItems: 'center', paddingVertical: 16 },
  statIcon: { backgroundColor: 'transparent', marginBottom: 4 },
  metric: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  label: { color: COLORS.muted, fontSize: 12, marginTop: 2, fontWeight: '500' }
});