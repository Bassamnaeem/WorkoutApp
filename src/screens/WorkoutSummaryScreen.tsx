import {CommonActions} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {WorkoutSummaryScreenProps} from '../navigation/types';
import {colors, spacing, typography} from '../theme';
import type {Exercise} from '../types';
import {formatDateTime} from '../utils/formatting';

export function WorkoutSummaryScreen({
  route,
  navigation,
}: WorkoutSummaryScreenProps) {
  const insets = useSafeAreaInsets();
  const {workout} = route.params;
  const {saveWorkout} = useWorkoutContext();
  const typeInfo = getWorkoutTypeInfo(workout.type);

  const [saved, setSaved] = useState(false);

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
        let detail = `${e.sets}x${e.reps}`;
        if (e.weight) {
          detail += ` @ ${e.weight}kg`;
        }
        return `- ${e.name}: ${detail}`;
      })
      .join('\n');

    Alert.alert(
      'Share Workout',
      `${typeInfo.icon} ${typeInfo.label} Workout\n${formatDateTime(workout.completedAt)}\n\n${exerciseList}\n\nLogged with WorkoutApp`,
    );
  };

  const renderExercise = ({item}: {item: Exercise}) => {
    const details: string[] = [
      `${item.sets} ${item.sets === 1 ? 'set' : 'sets'} \u00D7 ${item.reps} ${item.reps === 1 ? 'rep' : 'reps'}`,
    ];
    if (item.weight) {
      details.push(`${item.weight} kg`);
    }
    if (item.duration) {
      details.push(`${item.duration} min`);
    }

    return (
      <Card style={styles.exerciseCard} variant="outlined">
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDetails}>{details.join('  \u00B7  ')}</Text>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workout.exercises}
        keyExtractor={item => item.id}
        renderItem={renderExercise}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 140},
        ]}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.successIcon}>
                {'\u{1F389}'}
              </Text>
              <Text style={styles.title}>Workout Complete!</Text>
            </View>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryIcon}>{typeInfo.icon}</Text>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryType}>{typeInfo.label}</Text>
                  <Text style={styles.summaryDate}>
                    {formatDateTime(workout.completedAt)}
                  </Text>
                </View>
              </View>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatNumber}>
                    {workout.exercises.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    {workout.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                  </Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatNumber}>
                    {workout.exercises.reduce((sum, e) => sum + e.sets, 0)}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Total Sets</Text>
                </View>
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Exercises</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[styles.footer, {paddingBottom: insets.bottom + spacing.md}]}>
        <Button
          title={saved ? '\u2713  Saved!' : 'Save Workout'}
          onPress={handleSave}
          disabled={saved}
          style={saved ? styles.savedButton : undefined}
        />
        <Button
          title="Share Workout"
          onPress={handleShare}
          variant="outline"
          disabled={saved}
        />
      </View>
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryType: {
    ...typography.h3,
    color: colors.text,
  },
  summaryDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  summaryStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    marginBottom: spacing.sm + 2,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  exerciseDetails: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  savedButton: {
    backgroundColor: colors.success,
  },
});
