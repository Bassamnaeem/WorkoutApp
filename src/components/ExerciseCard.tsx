import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {borderRadius, colors, spacing, typography} from '../theme';
import type {Exercise} from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseCard({exercise, onEdit, onDelete}: ExerciseCardProps) {
  const details: string[] = [
    `${exercise.sets} ${exercise.sets === 1 ? 'set' : 'sets'} \u00D7 ${exercise.reps} ${exercise.reps === 1 ? 'rep' : 'reps'}`,
  ];

  if (exercise.weight) {
    details.push(`${exercise.weight} kg`);
  }
  if (exercise.duration) {
    details.push(`${exercise.duration} min`);
  }

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.details}>{details.join('  \u00B7  ')}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  content: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  details: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  editText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  deleteText: {
    ...typography.captionBold,
    color: colors.error,
  },
});
