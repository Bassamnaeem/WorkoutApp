import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {borderRadius, colors, spacing, typography} from '../theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  optional?: boolean;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  style,
  inputStyle,
  optional = false,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}>Optional</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : undefined,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  label: {
    ...typography.captionBold,
    color: colors.text,
  },
  optional: {
    ...typography.small,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
