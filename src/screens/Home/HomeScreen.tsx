import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Avatar, Button } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useListGroupsQuery } from '../../api/groupsApi';
import { useListExpensesQuery } from '../../api/expensesApi';
import { useListSettlementsQuery } from '../../api/settlementsApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useNavigation } from '@react-navigation/native';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { data: groups = [] } = useListGroupsQuery();
  const { data: expenses = [] } = useListExpensesQuery();
  const { data: settlements = [] } = useListSettlementsQuery();

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return (
    <Screen scroll>
      <HeroHeader
        title="Dashboard"
        subtitle="Your expense overview at a glance"
        icon="chart-bar"
        badge={`${groups.length} groups`}
      >
        <View style={styles.heroAmountRow}>
          <Text style={styles.heroLabel}>Total spent</Text>
          <Text style={styles.heroMetric}>{totalSpent.toFixed(2)} <Text style={styles.heroCurrency}>INR</Text></Text>
        </View>
      </HeroHeader>

      <SectionHeader title="Quick stats" subtitle="Groups, expenses, and settlements" />

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

      <Card style={styles.ctaCard} mode="contained">
        <Card.Content style={styles.ctaContent}>
          <View>
            <Text style={styles.ctaTitle}>Add an expense</Text>
            <Text style={styles.ctaSubtitle}>Capture a split in seconds</Text>
          </View>
          <Button mode="contained" onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}>
            Add expense
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroAmountRow: { marginTop: 6 },
  heroLabel: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  heroMetric: { fontSize: 30, fontWeight: '700', color: '#ffffff', marginTop: 4 },
  heroCurrency: { fontSize: 16, fontWeight: 'normal', color: '#cbd5f5' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { 
    flex: 1, 
    minWidth: '30%', 
    backgroundColor: '#ffffff',
    borderRadius: 0,
  },
  statContent: { alignItems: 'center', paddingVertical: 16 },
  statIcon: { backgroundColor: 'transparent', marginBottom: 4 },
  metric: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  label: { color: COLORS.muted, fontSize: 12, marginTop: 2, fontWeight: '500' }
  ,
  ctaCard: { marginTop: 16, borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  ctaContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  ctaTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
  ctaSubtitle: { color: COLORS.muted, marginTop: 4 }
});
