import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {HomeScreenProps} from '../navigation/types';
import {borderRadius, colors, shadow, spacing, typography} from '../theme';
import {formatTime} from '../utils/formatting';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning!';
  }
  if (hour < 17) {
    return 'Good Afternoon!';
  }
  return 'Good Evening!';
}

export function HomeScreen({navigation}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const {totalWorkouts, totalDuration, totalCalories, history} =
    useWorkoutContext();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.subtitle}>Ready to crush your workout?</Text>

      {/* Start Workout Card */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('WorkoutSelection')}
        style={styles.startCard}>
        <LinearGradient
          colors={['#F97316', '#EA580C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.startCardTitle}>Start a Workout</Text>
        <Text style={styles.startCardSubtitle}>
          Choose from cardio, strength, yoga & more
        </Text>
        <View style={styles.newWorkoutButton}>
          <Text style={styles.newWorkoutButtonIcon}>+</Text>
          <Text style={styles.newWorkoutButtonText}>New Workout</Text>
        </View>
      </TouchableOpacity>

      {/* This Week Stats */}
      <Text style={styles.sectionTitle}>This Week</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📈</Text>
          <Text style={styles.statNumber}>{formatTime(totalDuration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statNumber}>{totalCalories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
      </View>

      {/* Recent Workouts */}
      <Text style={styles.sectionTitle}>Recent Workouts</Text>
      {history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Text style={styles.emptySubtitle}>
            Start your first workout to see it here!
          </Text>
        </View>
      ) : (
        <View style={styles.recentList}>
          {history.slice(0, 3).map(workout => {
            const typeInfo = getWorkoutTypeInfo(workout.type);
            const totalSets = workout.exercises.reduce(
              (sum, e) => sum + e.sets.length,
              0,
            );
            const completedSets = workout.exercises.reduce(
              (sum, e) => sum + e.sets.filter(s => s.completed).length,
              0,
            );

            return (
              <TouchableOpacity
                key={workout.id}
                style={styles.recentCard}
                onPress={() => navigation.navigate('WorkoutHistory')}>
                <View
                  style={[
                    styles.recentIconContainer,
                    {backgroundColor: typeInfo.gradientStart + '20'},
                  ]}>
                  <Text style={styles.recentIcon}>{typeInfo.icon}</Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentType}>{typeInfo.label}</Text>
                  <Text style={styles.recentMeta}>
                    {completedSets}/{totalSets} sets · {formatTime(workout.duration)}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
          {history.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('WorkoutHistory')}>
              <Text style={styles.viewAllText}>View All History</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  startCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  startCardTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  startCardSubtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: spacing.md,
  },
  newWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  newWorkoutButtonIcon: {
    fontSize: 18,
    color: colors.primary,
    marginRight: spacing.xs,
    fontWeight: '600',
  },
  newWorkoutButtonText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statNumber: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadow,
    overflow: 'hidden',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  recentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recentIcon: {
    fontSize: 22,
  },
  recentInfo: {
    flex: 1,
  },
  recentType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  recentMeta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  viewAllButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  viewAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
});
