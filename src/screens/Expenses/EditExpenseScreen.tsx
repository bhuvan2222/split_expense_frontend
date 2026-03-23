import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useGetExpenseQuery, useUpdateExpenseMutation } from '../../api/expensesApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const EditExpenseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const expenseId = route.params?.expenseId as string;
  const { data: expense } = useGetExpenseQuery({ id: expenseId });
  const [updateExpense, { isLoading }] = useUpdateExpenseMutation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(String(expense.amount));
    }
  }, [expense]);

  const handleSubmit = async () => {
    await updateExpense({ id: expenseId, body: { title, amount: Number(amount) } }).unwrap();
    navigation.goBack();
  };

  return (
    <Screen>
      <HeroHeader title="Edit expense" subtitle="Adjust details and keep everyone aligned" icon="pencil" />
      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput mode="outlined" label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
          <Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading || !title || !amount} style={styles.primaryButton}>
            Save changes
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  primaryButton: { marginTop: 8 }
});
