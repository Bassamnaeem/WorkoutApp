import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {Workout, WorkoutType} from '../types';

export type RootStackParamList = {
  Home: undefined;
  WorkoutSelection: undefined;
  ExerciseLogging: {workoutType: WorkoutType};
  WorkoutSummary: {workout: Workout};
  WorkoutHistory: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export type WorkoutSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutSelection'
>;

export type ExerciseLoggingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ExerciseLogging'
>;

export type WorkoutSummaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutSummary'
>;

export type WorkoutHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WorkoutHistory'
>;
