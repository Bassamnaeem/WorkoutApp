import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AddExerciseModal} from '../components/AddExerciseModal';
import {RestTimerModal} from '../components/RestTimerModal';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {ExerciseLoggingScreenProps} from '../navigation/types';
import {borderRadius, colors, shadow, spacing, typography} from '../theme';
import type {Exercise, ExerciseSet} from '../types';
import {generateId} from '../utils/id';

export function ExerciseLoggingScreen({
  route,
  navigation,
}: ExerciseLoggingScreenProps) {
  const insets = useSafeAreaInsets();
  const {workoutType} = route.params;
  const typeInfo = getWorkoutTypeInfo(workoutType);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(60);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate totals
  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = exercises.reduce(
    (sum, e) => sum + e.sets.filter(s => s.completed).length,
    0,
  );

  const handleAddExercise = useCallback((name: string) => {
    const newExercise: Exercise = {
      id: generateId(),
      name,
      sets: [{weight: 0, reps: 0, completed: false}],
    };
    setExercises(prev => [...prev, newExercise]);
    setModalVisible(false);
  }, []);

  const handleAddSet = useCallback((exerciseId: string) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: [...e.sets, {weight: 0, reps: 0, completed: false}],
            }
          : e,
      ),
    );
  }, []);

  const handleUpdateSet = useCallback(
    (exerciseId: string, setIndex: number, field: keyof ExerciseSet, value: number | boolean) => {
      setExercises(prev =>
        prev.map(e =>
          e.id === exerciseId
            ? {
                ...e,
                sets: e.sets.map((s, i) =>
                  i === setIndex ? {...s, [field]: value} : s,
                ),
              }
            : e,
        ),
      );
    },
    [],
  );

  const handleToggleSetComplete = useCallback(
    (exerciseId: string, setIndex: number) => {
      // Check if set is currently completed before toggling
      const exercise = exercises.find(e => e.id === exerciseId);
      const isCurrentlyCompleted = exercise?.sets[setIndex]?.completed ?? false;

      setExercises(prev =>
        prev.map(e =>
          e.id === exerciseId
            ? {
                ...e,
                sets: e.sets.map((s, i) =>
                  i === setIndex ? {...s, completed: !s.completed} : s,
                ),
              }
            : e,
        ),
      );

      // Show rest timer only when marking as complete (not when unchecking)
      if (!isCurrentlyCompleted) {
        setShowRestTimer(true);
      }
    },
    [exercises],
  );

  const handleDeleteExercise = useCallback((exerciseId: string) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            setExercises(prev => prev.filter(e => e.id !== exerciseId)),
        },
      ],
    );
  }, []);

  const handleDiscard = () => {
    Alert.alert(
      'Discard Workout',
      'Are you sure you want to discard this workout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const handleFinish = () => {
    if (exercises.length === 0) {
      Alert.alert(
        'No Exercises Added',
        'Add at least one exercise before finishing your workout.',
        [{text: 'Got it'}],
      );
      return;
    }

    navigation.navigate('WorkoutSummary', {
      workout: {
        id: generateId(),
        type: workoutType,
        exercises,
        completedAt: new Date().toISOString(),
        duration: elapsedTime,
      },
    });
  };

  // Format timer display
  const formatTimer = (seconds: number) => {
    return `${seconds}s`;
  };

  // Hide default header
  useEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, {paddingTop: insets.top + spacing.sm}]}>
        <TouchableOpacity
          onPress={handleDiscard}
          style={styles.backButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.workoutIcon}>{typeInfo.icon}</Text>
            <Text style={styles.workoutTitle}>{typeInfo.label}</Text>
          </View>
          <Text style={styles.setsCount}>
            {completedSets}/{totalSets} sets completed
          </Text>
        </View>

        <View style={styles.timerBadge}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText}>{formatTimer(elapsedTime)}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Empty State */}
        {exercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyTitle}>No exercises yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first exercise to start tracking your workout
            </Text>
            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise Cards */}
        {exercises.map(exercise => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteExercise(exercise.id)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>

            {/* Column Headers */}
            <View style={styles.columnHeaders}>
              <Text style={[styles.columnHeader, styles.setColumn]}>SET</Text>
              <Text style={[styles.columnHeader, styles.weightColumn]}>
                WEIGHT
              </Text>
              <Text style={[styles.columnHeader, styles.repsColumn]}>REPS</Text>
              <View style={styles.checkColumn} />
            </View>

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={[styles.setNumber, styles.setColumn]}>
                  {setIndex + 1}
                </Text>
                <View style={styles.weightColumn}>
                  <TextInput
                    style={styles.input}
                    value={set.weight > 0 ? String(set.weight) : ''}
                    onChangeText={text => {
                      const num = parseInt(text, 10) || 0;
                      handleUpdateSet(exercise.id, setIndex, 'weight', num);
                    }}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={styles.repsColumn}>
                  <TextInput
                    style={styles.input}
                    value={set.reps > 0 ? String(set.reps) : ''}
                    onChangeText={text => {
                      const num = parseInt(text, 10) || 0;
                      handleUpdateSet(exercise.id, setIndex, 'reps', num);
                    }}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <TouchableOpacity
                  style={styles.checkColumn}
                  onPress={() => handleToggleSetComplete(exercise.id, setIndex)}>
                  <View
                    style={[
                      styles.checkbox,
                      set.completed && styles.checkboxChecked,
                    ]}>
                    {set.completed && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Set Button */}
            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() => handleAddSet(exercise.id)}>
              <Text style={styles.addSetIcon}>+</Text>
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Another Exercise Button */}
        {exercises.length > 0 && (
          <TouchableOpacity
            style={styles.addAnotherButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.addAnotherIcon}>+</Text>
            <Text style={styles.addAnotherText}>Add Another Exercise</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + spacing.md}]}>
        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
          <Text style={styles.discardIcon}>×</Text>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishIcon}>✓</Text>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Add Exercise Modal */}
      <AddExerciseModal
        visible={modalVisible}
        workoutType={typeInfo}
        onClose={() => setModalVisible(false)}
        onAddExercise={handleAddExercise}
      />

      {/* Rest Timer Modal */}
      <RestTimerModal
        visible={showRestTimer}
        initialDuration={restDuration}
        onClose={() => setShowRestTimer(false)}
        onDurationChange={setRestDuration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  workoutTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  setsCount: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  timerText: {
    ...typography.captionBold,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  addExerciseButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  addExerciseButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  deleteIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  columnHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  columnHeader: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  setColumn: {
    width: 40,
  },
  weightColumn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  repsColumn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  checkColumn: {
    width: 40,
    alignItems: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  setNumber: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  addSetIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  addSetText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...shadow,
  },
  addAnotherIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  addAnotherText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  discardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
  },
  discardIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  discardText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  finishButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
  },
  finishIcon: {
    fontSize: 18,
    color: colors.white,
    marginRight: spacing.xs,
  },
  finishText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
