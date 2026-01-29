import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {EmptyState} from '../components/EmptyState';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {WorkoutHistoryScreenProps} from '../navigation/types';
import {borderRadius, colors, shadow, spacing, typography} from '../theme';
import type {Workout} from '../types';
import {formatDateTime, formatTime} from '../utils/formatting';

export function WorkoutHistoryScreen({
  navigation,
}: WorkoutHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const {history} = useWorkoutContext();

  const renderWorkout = ({item}: {item: Workout}) => {
    const typeInfo = getWorkoutTypeInfo(item.type);
    const totalSets = item.exercises.reduce((sum, e) => sum + e.sets.length, 0);
    const completedSets = item.exercises.reduce(
      (sum, e) => sum + e.sets.filter(s => s.completed).length,
      0,
    );
    const estimatedCalories = Math.round(item.duration / 60 * 5);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: typeInfo.gradientStart + '20'},
            ]}>
            <Text style={styles.icon}>{typeInfo.icon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardType}>{typeInfo.label}</Text>
            <Text style={styles.cardDate}>{formatDateTime(item.completedAt)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statText}>{formatTime(item.duration)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔢</Text>
            <Text style={styles.statText}>
              {completedSets}/{totalSets} sets
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statText}>{estimatedCalories} cal</Text>
          </View>
        </View>

        <View style={styles.exerciseTags}>
          {item.exercises.slice(0, 3).map(exercise => (
            <View key={exercise.id} style={styles.exerciseTag}>
              <Text style={styles.exerciseTagText}>{exercise.name}</Text>
            </View>
          ))}
          {item.exercises.length > 3 && (
            <Text style={styles.moreExercises}>
              +{item.exercises.length - 3} more
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderWorkout}
        contentContainerStyle={[
          styles.list,
          history.length === 0 && styles.emptyList,
          {paddingBottom: insets.bottom + spacing.lg},
        ]}
        ListHeaderComponent={
          history.length > 0 ? (
            <Text style={styles.countText}>
              {history.length} {history.length === 1 ? 'workout' : 'workouts'}{' '}
              logged
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No Workouts Yet"
            message="Your completed workouts will show up here. Start your first workout to begin tracking your progress."
            actionLabel="Start a Workout"
            onAction={() => navigation.navigate('WorkoutSelection')}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  cardDate: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  statText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  exerciseTag: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  exerciseTagText: {
    ...typography.small,
    color: colors.text,
  },
  moreExercises: {
    ...typography.small,
    color: colors.textSecondary,
    alignSelf: 'center',
    marginLeft: spacing.xs,
  },
});
