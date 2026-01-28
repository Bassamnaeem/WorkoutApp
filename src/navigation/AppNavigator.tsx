import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ExerciseLoggingScreen} from '../screens/ExerciseLoggingScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {WorkoutHistoryScreen} from '../screens/WorkoutHistoryScreen';
import {WorkoutSelectionScreen} from '../screens/WorkoutSelectionScreen';
import {WorkoutSummaryScreen} from '../screens/WorkoutSummaryScreen';
import {colors, typography} from '../theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTintColor: colors.primary,
        headerTitleStyle: {
          ...typography.bodyBold,
          color: colors.text,
        },
        headerShadowVisible: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WorkoutSelection"
        component={WorkoutSelectionScreen}
        options={{title: 'Choose Workout'}}
      />
      <Stack.Screen
        name="ExerciseLogging"
        component={ExerciseLoggingScreen}
        options={{title: 'Log Exercises'}}
      />
      <Stack.Screen
        name="WorkoutSummary"
        component={WorkoutSummaryScreen}
        options={{title: 'Summary', headerBackVisible: false}}
      />
      <Stack.Screen
        name="WorkoutHistory"
        component={WorkoutHistoryScreen}
        options={{title: 'History'}}
      />
    </Stack.Navigator>
  );
}
