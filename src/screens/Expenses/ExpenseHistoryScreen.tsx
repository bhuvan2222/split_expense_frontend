import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ExpenseCard } from '../../components/expense/ExpenseCard';
import { useListExpensesQuery } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';

export const ExpenseHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string | undefined;
  const { data: expenses = [], isLoading } = useListExpensesQuery(groupId ? { groupId } : undefined);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>All Expenses</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Track your recent activity</Text>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : expenses.length === 0 ? (
        <EmptyState title="No expenses yet" subtitle="Add your first expense." />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExpenseCard expense={item} onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })} />
          )}
        />
      )}

      <View style={styles.fabContainer}>
        <FAB 
          icon="file-upload" 
          style={styles.secondaryFab}
          color={COLORS.primary}
          onPress={() => navigation.navigate('ImportBill', { groupId })} 
        />
        <FAB 
          icon="plus" 
          style={styles.primaryFab}
          color="#ffffff"
          onPress={() => navigation.navigate('AddExpense', { groupId })} 
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: COLORS.text, fontWeight: 'bold' },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  
  listContainer: { paddingBottom: 100 },
  
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  secondaryFab: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  primaryFab: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  }
});