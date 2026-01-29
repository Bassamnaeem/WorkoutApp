import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {Workout} from '../types';

const STORAGE_KEY = '@workout_history';

interface WorkoutContextValue {
  history: Workout[];
  saveWorkout: (workout: Workout) => void;
  lastWorkout: Workout | undefined;
  totalWorkouts: number;
  totalDuration: number; // in seconds
  totalCalories: number;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(
  undefined,
);

export function WorkoutProvider({children}: {children: React.ReactNode}) {
  const [history, setHistory] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorkout = useCallback(async (workout: Workout) => {
    setHistory(prev => {
      const newHistory = [workout, ...prev];
      // Persist to AsyncStorage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory)).catch(e => {
        console.error('Failed to save:', e);
      });
      return newHistory;
    });
  }, []);

  const value = useMemo<WorkoutContextValue>(() => {
    const totalDuration = history.reduce((sum, w) => sum + w.duration, 0);
    // Rough calorie estimate: ~5 cal per minute of exercise
    const totalCalories = history.reduce((sum, w) => sum + Math.round(w.duration / 60 * 5), 0);

    return {
      history,
      saveWorkout,
      lastWorkout: history[0],
      totalWorkouts: history.length,
      totalDuration,
      totalCalories,
      isLoading,
    };
  }, [history, saveWorkout, isLoading]);

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
