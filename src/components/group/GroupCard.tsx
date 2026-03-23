import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import type { Group } from '../../api/groupsApi';

export const GroupCard = ({ group, onPress }: { group: Group; onPress?: () => void }) => (
  <Card style={styles.card} onPress={onPress} mode="elevated" elevation={1}>
    <Card.Content style={styles.cardContent}>
      
      {/* Visual Avatar / Emoji section */}
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{group.emoji || '👥'}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={styles.groupName} numberOfLines={1}>
            {group.name}
          </Text>
          {group.isArchived ? (
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedText}>Archived</Text>
            </View>
          ) : null}
        </View>

        {group.description ? (
          <Text style={styles.subtitle} numberOfLines={1}>{group.description}</Text>
        ) : null}

        {/* Modern Pill-style Metadata */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{group.counts?.members ?? 0} Members</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{group.counts?.expenses ?? 0} Expenses</Text>
          </View>
          <View style={[styles.chip, styles.currencyChip]}>
            <Text style={[styles.chipText, styles.currencyText]}>{group.currency ?? 'INR'}</Text>
          </View>
        </View>
      </View>
      
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: { 
    marginBottom: 12, 
    backgroundColor: '#ffffff',
    borderRadius: 0,
    marginHorizontal: -20,
    width: '100%',
    alignSelf: 'stretch',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: { fontSize: 24 },
  
  infoContainer: { flex: 1 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 2,
  },
  groupName: { fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  subtitle: { color: COLORS.muted, fontSize: 13, marginBottom: 8 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip: { 
    backgroundColor: '#f1f3f5', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  chipText: { color: '#495057', fontSize: 11, fontWeight: '600' },
  
  currencyChip: { backgroundColor: COLORS.primary + '1A' }, // 10% opacity primary color
  currencyText: { color: COLORS.primary },

  archivedBadge: {
    backgroundColor: COLORS.danger + '1A', // Light danger background
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  archivedText: { color: COLORS.danger, fontSize: 10, fontWeight: 'bold' }
});
