import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {borderRadius, colors, spacing, typography} from '../theme';

interface RestTimerModalProps {
  visible: boolean;
  initialDuration: number;
  onClose: () => void;
  onDurationChange: (duration: number) => void;
}

const PRESET_DURATIONS = [30, 60, 90, 120];

export function RestTimerModal({
  visible,
  initialDuration,
  onClose,
  onDurationChange,
}: RestTimerModalProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset timer when modal opens
  useEffect(() => {
    if (visible) {
      setTimeLeft(initialDuration);
      setSelectedDuration(initialDuration);
    }
  }, [visible, initialDuration]);

  // Countdown timer
  useEffect(() => {
    if (visible && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible, timeLeft > 0]);

  // Auto-dismiss when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && visible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, visible, onClose]);

  const handlePresetSelect = useCallback((duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    onDurationChange(duration);
  }, [onDurationChange]);

  const handleSkip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  }, [onClose]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = selectedDuration > 0 ? timeLeft / selectedDuration : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Rest Timer</Text>

          {/* Circular Progress Display */}
          <View style={styles.timerContainer}>
            <View style={styles.progressRing}>
              <View
                style={[
                  styles.progressFill,
                  {
                    transform: [{rotate: `${(1 - progress) * 360}deg`}],
                  },
                ]}
              />
              <View style={styles.timerInner}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </View>
            </View>
          </View>

          {/* Duration Presets */}
          <View style={styles.presetsContainer}>
            {PRESET_DURATIONS.map(duration => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.presetButton,
                  selectedDuration === duration && styles.presetButtonActive,
                ]}
                onPress={() => handlePresetSelect(duration)}>
                <Text
                  style={[
                    styles.presetText,
                    selectedDuration === duration && styles.presetTextActive,
                  ]}>
                  {duration}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  timerContainer: {
    marginBottom: spacing.lg,
  },
  progressRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  timerInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  presetButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  presetText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: colors.primary,
  },
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    width: '100%',
    alignItems: 'center',
  },
  skipText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
});
