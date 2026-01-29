import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WORKOUT_TYPES} from '../data/workoutTypes';
import type {WorkoutSelectionScreenProps} from '../navigation/types';
import type {WorkoutTypeInfo} from '../types';

export function WorkoutSelectionScreen({
  navigation,
}: WorkoutSelectionScreenProps) {
  const insets = useSafeAreaInsets();

  const handleSelectWorkout = (workoutType: WorkoutTypeInfo) => {
    navigation.navigate('ExerciseLogging', {workoutType: workoutType.id});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + 24},
      ]}
      showsVerticalScrollIndicator={false}>
      {WORKOUT_TYPES.map(workoutType => (
        <TouchableOpacity
          key={workoutType.id}
          activeOpacity={0.85}
          onPress={() => handleSelectWorkout(workoutType)}
          style={styles.cardWrapper}>
          <LinearGradient
            colors={[workoutType.gradientStart, workoutType.gradientEnd]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            {/* Decorative circle */}
            <View
              style={[
                styles.decorativeCircle,
                {backgroundColor: 'rgba(255, 255, 255, 0.15)'},
              ]}
            />

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.emoji}>{workoutType.icon}</Text>
              <Text style={styles.title}>{workoutType.label}</Text>
              <Text style={styles.subtitle}>{workoutType.description}</Text>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Start workout</Text>
                <Text style={styles.ctaArrow}>→</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  card: {
    minHeight: 130,
    position: 'relative',
  },
  decorativeCircle: {
    position: 'absolute',
    right: -30,
    top: '50%',
    marginTop: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cardContent: {
    padding: 18,
    paddingBottom: 16,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 4,
  },
  ctaArrow: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
