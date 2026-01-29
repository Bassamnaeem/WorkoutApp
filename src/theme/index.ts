export const colors = {
  // Primary orange from screenshots
  primary: '#F97316',
  primaryLight: '#FFF7ED',
  primaryDark: '#EA580C',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Status colors
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Workout type gradients
  cardio: {
    start: '#14B8A6',
    end: '#0D9488',
  },
  strength: {
    start: '#F97316',
    end: '#EA580C',
  },
  yoga: {
    start: '#2DD4BF',
    end: '#14B8A6',
  },
  hiit: {
    start: '#EC4899',
    end: '#DB2777',
  },
  stretching: {
    start: '#A855F7',
    end: '#9333EA',
  },
  sports: {
    start: '#FACC15',
    end: '#EAB308',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const typography = {
  h1: {fontSize: 28, fontWeight: '700' as const, lineHeight: 34},
  h2: {fontSize: 22, fontWeight: '700' as const, lineHeight: 28},
  h3: {fontSize: 18, fontWeight: '600' as const, lineHeight: 24},
  body: {fontSize: 16, fontWeight: '400' as const, lineHeight: 22},
  bodyBold: {fontSize: 16, fontWeight: '600' as const, lineHeight: 22},
  caption: {fontSize: 14, fontWeight: '400' as const, lineHeight: 20},
  captionBold: {fontSize: 14, fontWeight: '600' as const, lineHeight: 20},
  small: {fontSize: 12, fontWeight: '400' as const, lineHeight: 16},
  smallBold: {fontSize: 12, fontWeight: '600' as const, lineHeight: 16},
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

export const shadowLight = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 2,
};
