import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  primary: '#C45C3A',
  primaryLight: '#E8845E',
  primaryDark: '#9A3D20',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3F0',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  success: '#16A34A',
  error: '#DC2626',
  white: '#FFFFFF',

  dark: {
    background: '#111111',
    surface: '#1C1C1E',
    surfaceAlt: '#2C2C2E',
    text: '#F5F5F5',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    border: '#3A3A3C',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  hero: 36,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  serif: 'System',
};

export const screenWidth = width;
