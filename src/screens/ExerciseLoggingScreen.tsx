import React, {useCallback, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {EmptyState} from '../components/EmptyState';
import {ExerciseCard} from '../components/ExerciseCard';
import {ExerciseFormModal} from '../components/ExerciseFormModal';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {ExerciseLoggingScreenProps} from '../navigation/types';
import {colors, spacing, typography} from '../theme';
import type {Exercise} from '../types';
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
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  const handleAddExercise = useCallback(
    (values: Omit<Exercise, 'id'>) => {
      if (editingExercise) {
        setExercises(prev =>
          prev.map(e =>
            e.id === editingExercise.id ? {...values, id: e.id} : e,
          ),
        );
      } else {
        setExercises(prev => [...prev, {id: generateId(), ...values}]);
      }
      setModalVisible(false);
      setEditingExercise(undefined);
    },
    [editingExercise],
  );

  const handleEdit = useCallback((exercise: Exercise) => {
    setEditingExercise(exercise);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback((exerciseId: string) => {
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

  const handleOpenAdd = useCallback(() => {
    setEditingExercise(undefined);
    setModalVisible(true);
  }, []);

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
      },
    });
  };

  const renderExercise = useCallback(
    ({item}: {item: Exercise}) => (
      <ExerciseCard
        exercise={item}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id)}
      />
    ),
    [handleEdit, handleDelete],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={renderExercise}
        contentContainerStyle={[
          styles.list,
          exercises.length === 0 && styles.emptyList,
          {paddingBottom: insets.bottom + 140},
        ]}
        ListHeaderComponent={
          <View style={[styles.typeBanner, {backgroundColor: typeInfo.color + '12'}]}>
            <Text style={styles.typeIcon}>{typeInfo.icon}</Text>
            <View>
              <Text style={styles.typeLabel}>{typeInfo.label} Workout</Text>
              <Text style={styles.typeExerciseCount}>
                {exercises.length}{' '}
                {exercises.length === 1 ? 'exercise' : 'exercises'} added
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={'\u{1F4DD}'}
            title="No exercises yet"
            message="Add your first exercise to get started with this workout."
            actionLabel="Add Exercise"
            onAction={handleOpenAdd}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[styles.footer, {paddingBottom: insets.bottom + spacing.md}]}>
        {exercises.length > 0 && (
          <Button
            title="+ Add Exercise"
            onPress={handleOpenAdd}
            variant="secondary"
            style={styles.addButton}
          />
        )}
        <Button
          title="Finish Workout"
          onPress={handleFinish}
          disabled={exercises.length === 0}
        />
      </View>

      <ExerciseFormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingExercise(undefined);
        }}
        onSave={handleAddExercise}
        initialValues={editingExercise}
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
  },
  typeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  typeLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  typeExerciseCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
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
  addButton: {
    marginBottom: spacing.xs,
  },
});
