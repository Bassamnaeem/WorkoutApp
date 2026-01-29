import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text, View} from 'react-native';
import {ExerciseLoggingScreen} from '../screens/ExerciseLoggingScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {WorkoutHistoryScreen} from '../screens/WorkoutHistoryScreen';
import {WorkoutSelectionScreen} from '../screens/WorkoutSelectionScreen';
import {WorkoutSummaryScreen} from '../screens/WorkoutSummaryScreen';
import {colors, typography} from '../theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function CustomHeader({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <View style={{gap: 1}}>
      <Text style={{...typography.bodyBold, color: colors.text, lineHeight: 20}}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            ...typography.small,
            color: colors.textSecondary,
            lineHeight: 14,
          }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTintColor: colors.text,
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
        options={{
          headerTitle: () => (
            <CustomHeader
              title="Choose Workout"
              subtitle="What are we training today?"
            />
          ),
        }}
      />
      <Stack.Screen
        name="ExerciseLogging"
        component={ExerciseLoggingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WorkoutSummary"
        component={WorkoutSummaryScreen}
        options={{
          title: 'Workout Summary',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="WorkoutHistory"
        component={WorkoutHistoryScreen}
        options={{
          headerTitle: () => <CustomHeader title="Workout History" />,
        }}
      />
    </Stack.Navigator>
  );
}
