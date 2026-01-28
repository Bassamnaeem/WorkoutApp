import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {EmptyState} from '../components/EmptyState';
import {useWorkoutContext} from '../context/WorkoutContext';
import {getWorkoutTypeInfo} from '../data/workoutTypes';
import type {WorkoutHistoryScreenProps} from '../navigation/types';
import {colors, spacing, typography} from '../theme';
import type {Workout} from '../types';
import {formatDateTime} from '../utils/formatting';

export function WorkoutHistoryScreen({
  navigation,
}: WorkoutHistoryScreenProps) {
  const insets = useSafeAreaInsets();
  const {history} = useWorkoutContext();

  const renderWorkout = ({item}: {item: Workout}) => {
    const typeInfo = getWorkoutTypeInfo(item.type);
    const exerciseNames = item.exercises.map(e => e.name).join(', ');

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: typeInfo.color + '15'},
            ]}>
            <Text style={styles.icon}>{typeInfo.icon}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardType}>{typeInfo.label}</Text>
            <Text style={styles.cardDate}>
              {formatDateTime(item.completedAt)}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.exercises.length}{' '}
              {item.exercises.length === 1 ? 'ex.' : 'ex.'}
            </Text>
          </View>
        </View>
        <Text style={styles.exerciseList} numberOfLines={2}>
          {exerciseNames}
        </Text>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={renderWorkout}
        contentContainerStyle={[
          styles.list,
          history.length === 0 && styles.emptyList,
          {paddingBottom: insets.bottom + spacing.lg},
        ]}
        ListEmptyComponent={
          <EmptyState
            icon={'\u{1F4CB}'}
            title="No Workouts Yet"
            message="Your completed workouts will show up here. Start your first workout to begin tracking your progress."
            actionLabel="Start a Workout"
            onAction={() => navigation.navigate('WorkoutSelection')}
          />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          history.length > 0 ? (
            <Button
              title="Start New Workout"
              onPress={() => navigation.navigate('WorkoutSelection')}
              variant="secondary"
              style={styles.footerButton}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  cardDate: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  exerciseList: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footerButton: {
    marginTop: spacing.sm,
  },
});
