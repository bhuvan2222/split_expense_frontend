import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { COLORS } from '../../constants/colors';

export const ItemSplitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string | undefined;

  return (
    <Screen>
      <Text variant="headlineSmall" style={styles.title}>Item split</Text>
      <Text style={styles.subtitle}>
        Advanced item-wise splitting is coming next. For now, use custom split in Add Expense.
      </Text>
      <Button mode="contained" onPress={() => navigation.navigate('AddExpense', { groupId })}>
        Go to Add Expense
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  subtitle: { color: COLORS.muted, marginBottom: 24 }
});
