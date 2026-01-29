import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {WorkoutTypeInfo} from '../types';
import {borderRadius, colors, spacing, typography} from '../theme';

interface AddExerciseModalProps {
  visible: boolean;
  workoutType: WorkoutTypeInfo;
  onClose: () => void;
  onAddExercise: (exerciseName: string) => void;
}

function Separator() {
  return <View style={styles.separator} />;
}

export function AddExerciseModal({
  visible,
  workoutType,
  onClose,
  onAddExercise,
}: AddExerciseModalProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [customExercise, setCustomExercise] = useState('');

  const filteredExercises = workoutType.suggestedExercises.filter(exercise =>
    exercise.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddExercise = (name: string) => {
    onAddExercise(name);
    setSearchQuery('');
    setCustomExercise('');
  };

  const handleAddCustom = () => {
    if (customExercise.trim()) {
      handleAddExercise(customExercise.trim());
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setCustomExercise('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <View style={[styles.container, {paddingTop: insets.top + spacing.md}]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Exercise</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>

        {/* Custom Exercise Input */}
        <View style={styles.customContainer}>
          <TextInput
            style={styles.customInput}
            placeholder="Or add a custom exercise..."
            placeholderTextColor={colors.textTertiary}
            value={customExercise}
            onChangeText={setCustomExercise}
            onSubmitEditing={handleAddCustom}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              styles.addCustomButton,
              !customExercise.trim() && styles.addCustomButtonDisabled,
            ]}
            onPress={handleAddCustom}
            disabled={!customExercise.trim()}>
            <Text style={styles.addCustomIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Suggested Exercises */}
        <Text style={styles.suggestedTitle}>
          Suggested for {workoutType.label}
        </Text>
        <FlatList
          data={filteredExercises}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.exerciseRow}>
              <Text style={styles.exerciseName}>{item}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddExercise(item)}>
                <Text style={styles.addButtonIcon}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: colors.textSecondary,
    lineHeight: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  customContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingLeft: spacing.md,
  },
  customInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  addCustomButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    marginRight: 4,
  },
  addCustomButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  addCustomIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: '600',
  },
  suggestedTitle: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  exerciseName: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  addButton: {
    padding: spacing.sm,
  },
  addButtonIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
