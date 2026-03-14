import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Text, Avatar, List } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useListExpensesQuery } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';

// Helper to map categories to icons
const getCategoryIcon = (category: string) => {
  const lowercaseCat = category.toLowerCase();
  if (lowercaseCat.includes('food')) return 'silverware';
  if (lowercaseCat.includes('travel') || lowercaseCat.includes('transport')) return 'car';
  if (lowercaseCat.includes('shop')) return 'shopping';
  if (lowercaseCat.includes('house') || lowercaseCat.includes('rent')) return 'home';
  if (lowercaseCat.includes('movie') || lowercaseCat.includes('entertainment')) return 'movie';
  return 'tag'; // Default icon
};

export const ReportsScreen = () => {
  const { data: expenses = [] } = useListExpensesQuery();

  const totals = expenses.reduce((acc: Record<string, number>, exp) => {
    const key = exp.category || 'OTHER';
    acc[key] = (acc[key] ?? 0) + Number(exp.amount);
    return acc;
  }, {});

  const grandTotal = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Reports</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Your spending breakdown</Text>
      </View>

      {/* Hero Card for Grand Total */}
      <Card style={styles.heroCard} mode="elevated" elevation={2}>
        <Card.Content style={styles.heroContent}>
          <View>
            <Text style={styles.heroLabel}>Total Spending</Text>
            <Text style={styles.heroAmount}>₹{grandTotal.toFixed(2)}</Text>
          </View>
          <Avatar.Icon size={52} icon="chart-donut" style={styles.heroIcon} color={COLORS.primary} />
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>By Category</Text>

      <Card style={styles.listCard} mode="elevated" elevation={1}>
        <Card.Content style={{ padding: 0 }}>
          {Object.entries(totals).map(([category, amount], index, array) => (
            <React.Fragment key={category}>
              <List.Item
                title={category}
                titleStyle={styles.categoryTitle}
                description="Category total"
                descriptionStyle={styles.categoryDesc}
                left={props => (
                  <Avatar.Icon 
                    {...props} 
                    icon={getCategoryIcon(category)} 
                    size={40} 
                    style={styles.listIcon}
                    color={COLORS.primary} 
                  />
                )}
                right={props => (
                  <Text {...props} style={styles.amountText}>
                    ₹{amount.toFixed(2)}
                  </Text>
                )}
                style={styles.listItem}
              />
              {index < array.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
          {Object.keys(totals).length === 0 && (
            <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          )}
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: COLORS.text, fontWeight: 'bold' },
  subtitle: { color: COLORS.muted, marginTop: 4 },

  heroCard: {
    backgroundColor: COLORS.primary + '1A', // Light primary background
    borderRadius: 16,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: { color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  heroAmount: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
  heroIcon: { backgroundColor: '#ffffff' },

  sectionTitle: { fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  listItem: { paddingVertical: 8, paddingHorizontal: 16 },
  listIcon: { backgroundColor: '#f1f3f5' },
  categoryTitle: { fontWeight: '600', color: COLORS.text, textTransform: 'capitalize' },
  categoryDesc: { fontSize: 12 },
  amountText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, alignSelf: 'center', paddingRight: 8 },
  
  divider: { height: 1, backgroundColor: '#f1f3f5', marginLeft: 64 },
  emptyText: { padding: 20, textAlign: 'center', color: COLORS.muted },
});