import React from 'react';
import { FlatList, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ExpenseCard } from '../../components/expense/ExpenseCard';
import { useListExpensesQuery } from '../../api/expensesApi';

export const ExpenseHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string | undefined;
  const { data: expenses = [], isLoading } = useListExpensesQuery(groupId ? { groupId } : undefined);

  return (
    <Screen>
      {isLoading ? (
        <LoadingSpinner />
      ) : expenses.length === 0 ? (
        <EmptyState title="No expenses yet" subtitle="Add your first expense." />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard expense={item} onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })} />
          )}
        />
      )}

      <View style={{ position: 'absolute', right: 20, bottom: 20, gap: 12 }}>
        <FAB icon="file-upload" onPress={() => navigation.navigate('ImportBill', { groupId })} />
        <FAB icon="plus" onPress={() => navigation.navigate('AddExpense', { groupId })} />
      </View>
    </Screen>
  );
};
