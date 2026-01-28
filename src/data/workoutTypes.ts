import type {WorkoutType, WorkoutTypeInfo} from '../types';

export const WORKOUT_TYPES: WorkoutTypeInfo[] = [
  {
    id: 'cardio',
    label: 'Cardio',
    icon: '\u{1F3C3}',
    color: '#EF4444',
    description: 'Running, cycling, swimming',
  },
  {
    id: 'strength',
    label: 'Strength',
    icon: '\u{1F3CB}\u{FE0F}',
    color: '#3B82F6',
    description: 'Weight training & resistance',
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: '\u{1F9D8}',
    color: '#8B5CF6',
    description: 'Flexibility & mindfulness',
  },
  {
    id: 'hiit',
    label: 'HIIT',
    icon: '\u{26A1}',
    color: '#F59E0B',
    description: 'High intensity intervals',
  },
  {
    id: 'mobility',
    label: 'Mobility',
    icon: '\u{1F938}',
    color: '#10B981',
    description: 'Stretching & recovery',
  },
];

export function getWorkoutTypeInfo(type: WorkoutType): WorkoutTypeInfo {
  const info = WORKOUT_TYPES.find(wt => wt.id === type);
  if (!info) {
    throw new Error(`Unknown workout type: ${type}`);
  }
  return info;
}
