import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {borderRadius, colors, spacing, typography} from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const backgroundColors: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.primaryLight,
  outline: 'transparent',
  ghost: 'transparent',
  danger: colors.errorLight,
};

const disabledBackgrounds: Record<ButtonVariant, string> = {
  primary: colors.textTertiary,
  secondary: colors.surfaceSecondary,
  outline: 'transparent',
  ghost: 'transparent',
  danger: colors.surfaceSecondary,
};

const textColors: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.primary,
  outline: colors.primary,
  ghost: colors.primary,
  danger: colors.error,
};

const disabledTextColors: Record<ButtonVariant, string> = {
  primary: colors.white,
  secondary: colors.textTertiary,
  outline: colors.textTertiary,
  ghost: colors.textTertiary,
  danger: colors.textTertiary,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {backgroundColor: backgroundColors[variant]},
        variant === 'outline' && styles.outlineBorder,
        isDisabled && {backgroundColor: disabledBackgrounds[variant]},
        isDisabled && variant === 'outline' && styles.disabledOutline,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            {color: textColors[variant]},
            isDisabled && {color: disabledTextColors[variant]},
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabledOutline: {
    borderColor: colors.textTertiary,
  },
  text: {
    ...typography.bodyBold,
  },
});
