import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

export const SectionHeader = ({
  title,
  subtitle,
  right
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) => (
  <View style={styles.container}>
    <View style={styles.textBlock}>
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View style={styles.right}>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  textBlock: { flex: 1, paddingRight: 12 },
  title: { fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 4 },
  right: { alignItems: 'flex-end' }
});
