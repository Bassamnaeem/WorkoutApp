import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {borderRadius, colors, shadow, spacing} from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined';
}

export function Card({children, style, variant = 'elevated'}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  elevated: {
    ...shadow,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
