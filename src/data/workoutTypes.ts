import type {WorkoutType, WorkoutTypeInfo} from '../types';

export const WORKOUT_TYPES: WorkoutTypeInfo[] = [
  {
    id: 'cardio',
    label: 'Cardio',
    icon: '🏃',
    description: 'Running, cycling, swimming & more',
    gradientStart: '#14B8A6',
    gradientEnd: '#0D9488',
    suggestedExercises: [
      'Running',
      'Cycling',
      'Swimming',
      'Jump Rope',
      'Rowing',
      'Elliptical',
      'Stair Climber',
      'Walking',
    ],
  },
  {
    id: 'strength',
    label: 'Strength',
    icon: '💪',
    description: 'Build muscle with weights',
    gradientStart: '#F97316',
    gradientEnd: '#EA580C',
    suggestedExercises: [
      'Bench Press',
      'Squat',
      'Deadlift',
      'Shoulder Press',
      'Barbell Row',
      'Bicep Curl',
      'Tricep Extension',
      'Lat Pulldown',
    ],
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: '🧘',
    description: 'Flexibility & mindfulness',
    gradientStart: '#2DD4BF',
    gradientEnd: '#14B8A6',
    suggestedExercises: [
      'Sun Salutation',
      'Downward Dog',
      'Warrior Pose',
      'Tree Pose',
      'Child\'s Pose',
      'Cobra Pose',
      'Plank',
      'Bridge Pose',
    ],
  },
  {
    id: 'hiit',
    label: 'HIIT',
    icon: '⚡',
    description: 'High intensity interval training',
    gradientStart: '#EC4899',
    gradientEnd: '#DB2777',
    suggestedExercises: [
      'Burpees',
      'Mountain Climbers',
      'Jump Squats',
      'High Knees',
      'Box Jumps',
      'Battle Ropes',
      'Kettlebell Swings',
      'Sprints',
    ],
  },
  {
    id: 'stretching',
    label: 'Stretching',
    icon: '🤸',
    description: 'Recovery & mobility work',
    gradientStart: '#A855F7',
    gradientEnd: '#9333EA',
    suggestedExercises: [
      'Hamstring Stretch',
      'Quad Stretch',
      'Hip Flexor Stretch',
      'Shoulder Stretch',
      'Neck Stretch',
      'Cat-Cow Stretch',
      'Pigeon Pose',
      'Foam Rolling',
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: '⚽',
    description: 'Basketball, tennis, soccer & more',
    gradientStart: '#FACC15',
    gradientEnd: '#EAB308',
    suggestedExercises: [
      'Basketball',
      'Tennis',
      'Soccer',
      'Volleyball',
      'Badminton',
      'Golf',
      'Boxing',
      'Swimming',
    ],
  },
];

export function getWorkoutTypeInfo(type: WorkoutType): WorkoutTypeInfo {
  const info = WORKOUT_TYPES.find(wt => wt.id === type);
  if (!info) {
    throw new Error(`Unknown workout type: ${type}`);
  }
  return info;
}
