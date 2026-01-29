import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {WorkoutSummaryScreenProps} from '../navigation/types';
import {borderRadius, colors, shadow, spacing, typography} from '../theme';
import {formatTime} from '../utils/formatting';

export function WorkoutSummaryScreen({
  route,
  navigation,
}: WorkoutSummaryScreenProps) {
  const insets = useSafeAreaInsets();
  const {workout} = route.params;
  const {saveWorkout} = useWorkoutContext();
  const typeInfo = getWorkoutTypeInfo(workout.type);

  const [saved, setSaved] = useState(false);

  // Calculate stats
  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, e) => sum + e.sets.filter(s => s.completed).length,
    0,
  );
  const totalVolume = workout.exercises.reduce(
    (sum, e) =>
      sum + e.sets.reduce((setSum, s) => setSum + s.weight * s.reps, 0),
    0,
  );
  const estimatedCalories = Math.round(workout.duration / 60 * 5);

  // Configure header
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Workout Summary',
    });
  }, [navigation]);

  const handleSave = () => {
    saveWorkout(workout);
    setSaved(true);
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'Home'}]}),
      );
    }, 800);
  };

  const handleShare = () => {
    const exerciseList = workout.exercises
      .map(e => {
        const setsInfo = e.sets
          .map((s, i) => `Set ${i + 1}: ${s.weight}kg x ${s.reps}`)
          .join('\n');
        return `${e.name}\n${setsInfo}`;
      })
      .join('\n\n');

    Alert.alert(
      'Share Workout',
      `${typeInfo.icon} ${typeInfo.label} Workout\n\nDuration: ${formatTime(workout.duration)}\nSets: ${completedSets}/${totalSets}\nCalories: ~${estimatedCalories}\nVolume: ${totalVolume}kg\n\n${exerciseList}\n\nLogged with WorkoutApp`,
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + spacing.lg},
      ]}
      showsVerticalScrollIndicator={false}>
      {/* Trophy Section */}
      <View style={styles.trophySection}>
        <View style={styles.trophyContainer}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <View style={styles.checkBadge}>
            <Text style={styles.checkBadgeIcon}>✓</Text>
          </View>
        </View>
        <Text style={styles.greatWorkTitle}>Great Work!</Text>
        <Text style={styles.completedSubtitle}>
          You've completed your {typeInfo.label} workout
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{formatTime(workout.duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔢</Text>
          <Text style={styles.statValue}>
            {completedSets}/{totalSets}
          </Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>~{estimatedCalories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statValue}>{totalVolume}kg</Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>
      </View>

      {/* Exercises Section */}
      <Text style={styles.exercisesTitle}>Exercises</Text>
      {workout.exercises.map(exercise => {
        const exerciseSets = exercise.sets.length;
        const exerciseCompleted = exercise.sets.filter(s => s.completed).length;
        return (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {exerciseCompleted}/{exerciseSets} sets completed
              </Text>
            </View>
            <Text style={styles.exerciseChevron}>›</Text>
          </TouchableOpacity>
        );
      })}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={handleSave}
          disabled={saved}>
          <Text style={styles.saveIcon}>✓</Text>
          <Text style={styles.saveText}>
            {saved ? 'Saved!' : 'Save Workout'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          disabled={saved}>
          <Text style={styles.shareIcon}>📤</Text>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  trophySection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  trophyContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  trophyIcon: {
    fontSize: 40,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  greatWorkTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  completedSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  exercisesTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  exerciseMeta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  exerciseChevron: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
  },
  savedButton: {
    backgroundColor: colors.success,
  },
  saveIcon: {
    fontSize: 18,
    color: colors.white,
    marginRight: spacing.sm,
  },
  saveText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  shareIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  shareText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
});
