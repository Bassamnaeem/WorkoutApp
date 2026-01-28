import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {borderRadius, colors, spacing, typography} from '../theme';
import type {Exercise} from '../types';
import {
  hasErrors,
  validateExerciseForm,
  type ValidationErrors,
} from '../utils/validation';
import {Button} from './Button';
import {Input} from './Input';

interface ExerciseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: Omit<Exercise, 'id'>) => void;
  initialValues?: Exercise;
}

const EMPTY_FORM = {name: '', sets: '', reps: '', weight: '', duration: ''};

export function ExerciseFormModal({
  visible,
  onClose,
  onSave,
  initialValues,
}: ExerciseFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isEditing = !!initialValues;

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        setForm({
          name: initialValues.name,
          sets: String(initialValues.sets),
          reps: String(initialValues.reps),
          weight: initialValues.weight ? String(initialValues.weight) : '',
          duration: initialValues.duration ? String(initialValues.duration) : '',
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setSubmitted(false);
    }
  }, [visible, initialValues]);

  const updateField = (field: keyof typeof form) => (value: string) => {
    setForm(prev => ({...prev, [field]: value}));
    if (submitted) {
      const updated = {...form, [field]: value};
      setErrors(validateExerciseForm(updated));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    const validationErrors = validateExerciseForm(form);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    onSave({
      name: form.name.trim(),
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: form.weight ? Number(form.weight) : undefined,
      duration: form.duration ? Number(form.duration) : undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Exercise' : 'Add Exercise'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
              <Text style={styles.closeButton}>{'\u2715'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.form}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Input
              label="Exercise Name"
              value={form.name}
              onChangeText={updateField('name')}
              placeholder="e.g. Bench Press"
              error={errors.name}
            />

            <View style={styles.row}>
              <Input
                label="Sets"
                value={form.sets}
                onChangeText={updateField('sets')}
                placeholder="3"
                keyboardType="numeric"
                error={errors.sets}
                style={styles.halfInput}
              />
              <Input
                label="Reps"
                value={form.reps}
                onChangeText={updateField('reps')}
                placeholder="12"
                keyboardType="numeric"
                error={errors.reps}
                style={styles.halfInput}
              />
            </View>

            <View style={styles.row}>
              <Input
                label="Weight (kg)"
                value={form.weight}
                onChangeText={updateField('weight')}
                placeholder="0"
                keyboardType="numeric"
                error={errors.weight}
                optional
                style={styles.halfInput}
              />
              <Input
                label="Duration (min)"
                value={form.duration}
                onChangeText={updateField('duration')}
                placeholder="0"
                keyboardType="numeric"
                error={errors.duration}
                optional
                style={styles.halfInput}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="ghost"
              style={styles.footerButton}
            />
            <Button
              title={isEditing ? 'Update' : 'Add Exercise'}
              onPress={handleSave}
              style={styles.footerButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  closeButton: {
    fontSize: 18,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    flex: 1,
  },
});
