import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

export const EmptyState = ({ title = 'Nothing here yet', subtitle }: { title?: string; subtitle?: string }) => (
  <Card style={styles.card} mode="outlined">
    <Card.Content style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { borderRadius: 0, borderColor: '#e2e8f0', backgroundColor: '#ffffff', marginHorizontal: -20 },
  container: { paddingVertical: 20, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 6 }
});
