import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../lib/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color?: string;
}

export function InfoRow({ icon, text, color }: Props) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={color || colors.textTertiary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
});
