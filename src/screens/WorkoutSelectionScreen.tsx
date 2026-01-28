import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {EmptyState} from '../components/EmptyState';
import {WorkoutTypeCard} from '../components/WorkoutTypeCard';
import {WORKOUT_TYPES} from '../data/workoutTypes';
import type {WorkoutSelectionScreenProps} from '../navigation/types';
import {colors, spacing, typography} from '../theme';
import type {WorkoutType, WorkoutTypeInfo} from '../types';

export function WorkoutSelectionScreen({
  navigation,
}: WorkoutSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<WorkoutType | null>(null);
  const [types] = useState<WorkoutTypeInfo[]>(WORKOUT_TYPES);

  const handleStart = () => {
    if (selectedType) {
      navigation.navigate('ExerciseLogging', {workoutType: selectedType});
    }
  };

  if (types.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <EmptyState
          icon={'\u{1F50D}'}
          title="No Workouts Available"
          message="We couldn't load workout types. Please try again."
          actionLabel="Retry"
          onAction={() => {}}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={types}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <WorkoutTypeCard
            workoutType={item}
            selected={selectedType === item.id}
            onPress={() => setSelectedType(item.id)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 100},
        ]}
        ListHeaderComponent={
          <Text style={styles.prompt}>
            What are you training today?
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
      <View
        style={[styles.footer, {paddingBottom: insets.bottom + spacing.md}]}>
        <Button
          title="Start Workout"
          onPress={handleStart}
          disabled={!selectedType}
        />
        {!selectedType && (
          <Text style={styles.hint}>Select a workout type to continue</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  prompt: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
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
  },
  hint: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
