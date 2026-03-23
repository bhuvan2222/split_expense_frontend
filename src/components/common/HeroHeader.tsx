import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

type HeroHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  children?: React.ReactNode;
};

export const HeroHeader = ({ title, subtitle, icon, badge, children }: HeroHeaderProps) => (
  <Card style={styles.card} mode="contained">
    <View pointerEvents="none" style={styles.glowTop} />
    <View pointerEvents="none" style={styles.glowBottom} />
    <Card.Content style={styles.content}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text variant="headlineSmall" style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {icon ? (
          <Avatar.Icon size={54} icon={icon} style={styles.icon} color={COLORS.primary} />
        ) : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      {children ? <View style={styles.children}>{children}</View> : null}
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 20,
    marginHorizontal: -20,
  },
  glowTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#22c55e',
    opacity: 0.18,
    top: -80,
    right: -40,
  },
  glowBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#38bdf8',
    opacity: 0.16,
    bottom: -140,
    left: -60,
  },
  content: { paddingVertical: 18, paddingHorizontal: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textBlock: { flex: 1, paddingRight: 12 },
  title: { color: '#ffffff', fontWeight: '700' },
  subtitle: { color: '#cbd5f5', marginTop: 6 },
  icon: { backgroundColor: '#e2e8f0' },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f2937',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },
  badgeText: { color: '#93c5fd', fontSize: 12, fontWeight: '700' },
  children: { marginTop: 14 },
});
