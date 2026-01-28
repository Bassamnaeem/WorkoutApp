import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {HomeScreenProps} from '../navigation/types';
import {colors, spacing, typography} from '../theme';
import {formatDateTime} from '../utils/formatting';

export function HomeScreen({navigation}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const {lastWorkout, totalWorkouts, totalExercises} = useWorkoutContext();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg},
      ]}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Ready to train?</Text>
      <Text style={styles.subtitle}>
        {totalWorkouts > 0
          ? "Keep the momentum going."
          : 'Start your first workout today.'}
      </Text>

      {totalWorkouts > 0 && (
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>
                {totalWorkouts === 1 ? 'Workout' : 'Workouts'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{totalExercises}</Text>
              <Text style={styles.statLabel}>
                {totalExercises === 1 ? 'Exercise' : 'Exercises'}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {lastWorkout && (
        <Card style={styles.lastWorkoutCard}>
          <Text style={styles.lastWorkoutLabel}>Last Workout</Text>
          <View style={styles.lastWorkoutHeader}>
            <Text style={styles.lastWorkoutIcon}>
              {getWorkoutTypeInfo(lastWorkout.type).icon}
            </Text>
            <View style={styles.lastWorkoutInfo}>
              <Text style={styles.lastWorkoutType}>
                {getWorkoutTypeInfo(lastWorkout.type).label}
              </Text>
              <Text style={styles.lastWorkoutDate}>
                {formatDateTime(lastWorkout.completedAt)}
              </Text>
            </View>
          </View>
          <Text style={styles.lastWorkoutExercises}>
            {lastWorkout.exercises.length}{' '}
            {lastWorkout.exercises.length === 1 ? 'exercise' : 'exercises'}{' '}
            logged
          </Text>
        </Card>
      )}

      <View style={styles.actions}>
        <Button
          title="Start Workout"
          onPress={() => navigation.navigate('WorkoutSelection')}
        />
        {totalWorkouts > 0 && (
          <Button
            title="View History"
            onPress={() => navigation.navigate('WorkoutHistory')}
            variant="outline"
          />
        )}
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
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  lastWorkoutCard: {
    marginBottom: spacing.lg,
  },
  lastWorkoutLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  lastWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lastWorkoutIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  lastWorkoutInfo: {
    flex: 1,
  },
  lastWorkoutType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  lastWorkoutDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lastWorkoutExercises: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
  },
});
