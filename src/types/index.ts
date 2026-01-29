export type WorkoutType =
  | 'cardio'
  | 'strength'
  | 'yoga'
  | 'hiit'
  | 'stretching'
  | 'sports';

export interface WorkoutTypeInfo {
  id: WorkoutType;
  label: string;
  icon: string;
  description: string;
  gradientStart: string;
  gradientEnd: string;
  suggestedExercises: string[];
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  type: WorkoutType;
  exercises: Exercise[];
  completedAt: string;
  duration: number; // in seconds
}
