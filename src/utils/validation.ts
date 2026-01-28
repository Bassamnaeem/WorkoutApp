export interface ValidationErrors {
  name?: string;
  sets?: string;
  reps?: string;
  weight?: string;
  duration?: string;
}

interface ExerciseFormValues {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  duration: string;
}

export function validateExerciseForm(values: ExerciseFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Exercise name is required';
  }

  const sets = Number(values.sets);
  if (!values.sets || isNaN(sets) || sets < 1 || !Number.isInteger(sets)) {
    errors.sets = 'Enter a positive whole number';
  }

  const reps = Number(values.reps);
  if (!values.reps || isNaN(reps) || reps < 1 || !Number.isInteger(reps)) {
    errors.reps = 'Enter a positive whole number';
  }

  if (values.weight) {
    const weight = Number(values.weight);
    if (isNaN(weight) || weight < 0) {
      errors.weight = 'Enter a valid weight';
    }
  }

  if (values.duration) {
    const duration = Number(values.duration);
    if (isNaN(duration) || duration < 0) {
      errors.duration = 'Enter a valid duration';
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
