import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../lib/theme';

interface Props {
  text: string;
  variant?: 'default' | 'primary';
  style?: ViewStyle;
}

export function Badge({ text, variant = 'default', style }: Props) {
  return (
    <View style={[styles.badge, variant === 'primary' && styles.primary, style]}>
      <Text style={[styles.text, variant === 'primary' && styles.primaryText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  primaryText: {
    color: colors.white,
  },
});
