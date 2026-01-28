import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {borderRadius, colors, shadow, spacing, typography} from '../theme';
import type {WorkoutTypeInfo} from '../types';

interface WorkoutTypeCardProps {
  workoutType: WorkoutTypeInfo;
  selected: boolean;
  onPress: () => void;
}

export function WorkoutTypeCard({
  workoutType,
  selected,
  onPress,
}: WorkoutTypeCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && {borderColor: workoutType.color, borderWidth: 2},
        selected && {backgroundColor: workoutType.color + '08'},
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View
        style={[styles.iconContainer, {backgroundColor: workoutType.color + '15'}]}>
        <Text style={styles.icon}>{workoutType.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{workoutType.label}</Text>
        <Text style={styles.description}>{workoutType.description}</Text>
      </View>
      {selected && (
        <View style={[styles.checkmark, {backgroundColor: workoutType.color}]}>
          <Text style={styles.checkmarkText}>{'\u2713'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
