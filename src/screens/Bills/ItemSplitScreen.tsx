import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

export const ItemSplitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const groupId = route.params?.groupId as string | undefined;

  return (
    <Screen>
      <HeroHeader title="Item split" subtitle="Fine-grained splitting is on the way" icon="format-list-bulleted" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text style={styles.subtitle}>
            Advanced item-wise splitting is coming next. For now, use custom split in Add Expense.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('AddExpense', { groupId })}>
            Go to Add Expense
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  subtitle: { color: COLORS.muted, marginBottom: 16 }
});
