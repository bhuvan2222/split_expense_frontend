import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import type { BalanceLine } from '../../api/groupsApi';

export const BalanceSummary = ({ balances }: { balances: BalanceLine[] }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text variant="titleMedium">Balances</Text>
      {balances.length === 0 ? (
        <Text style={styles.muted}>All settled. No balances due.</Text>
      ) : (
        balances.slice(0, 5).map((line) => (
          <View key={`${line.from.id}-${line.to.id}`} style={styles.line}>
            <Text style={styles.name}>{line.from.name}</Text>
            <Text style={styles.muted}>owes</Text>
            <Text style={styles.name}>{line.to.name}</Text>
            <Text style={styles.amount}>₹{line.amount.toFixed(2)}</Text>
          </View>
        ))
      )}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  line: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 8 },
  name: { color: COLORS.text, fontWeight: '600' },
  muted: { color: COLORS.muted },
  amount: { color: COLORS.primary, fontWeight: '700' }
});
