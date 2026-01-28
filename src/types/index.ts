export type WorkoutType = 'cardio' | 'strength' | 'yoga' | 'hiit' | 'mobility';

export interface WorkoutTypeInfo {
  id: WorkoutType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  exercises: Exercise[];
  completedAt: string;
}
