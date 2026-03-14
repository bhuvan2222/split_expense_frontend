import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import type { Group } from '../../api/groupsApi';

export const GroupCard = ({ group, onPress }: { group: Group; onPress?: () => void }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content>
      <View style={styles.row}>
        <Text variant="titleMedium">{group.emoji ? `${group.emoji} ` : ''}{group.name}</Text>
        {group.isArchived ? <Text style={styles.archived}>Archived</Text> : null}
      </View>
      {group.description ? <Text style={styles.subtitle}>{group.description}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{group.currency ?? 'INR'}</Text>
        <Text style={styles.meta}>{group.counts?.members ?? 0} members</Text>
        <Text style={styles.meta}>{group.counts?.expenses ?? 0} expenses</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  meta: { color: COLORS.primary, fontSize: 12 },
  archived: { color: COLORS.danger, fontSize: 12 }
});
