import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import type {Workout} from '../types';

interface WorkoutContextValue {
  history: Workout[];
  saveWorkout: (workout: Workout) => void;
  lastWorkout: Workout | undefined;
  totalWorkouts: number;
  totalExercises: number;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(
  undefined,
);

export function WorkoutProvider({children}: {children: React.ReactNode}) {
  const [history, setHistory] = useState<Workout[]>([]);

  const saveWorkout = useCallback((workout: Workout) => {
    setHistory(prev => [workout, ...prev]);
  }, []);

  const value = useMemo<WorkoutContextValue>(() => {
    const totalExercises = history.reduce(
      (sum, w) => sum + w.exercises.length,
      0,
    );
    return {
      history,
      saveWorkout,
      lastWorkout: history[0],
      totalWorkouts: history.length,
      totalExercises,
    };
  }, [history, saveWorkout]);

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkoutContext(): WorkoutContextValue {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within WorkoutProvider');
  }
  return context;
}
