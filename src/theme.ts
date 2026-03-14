import { MD3LightTheme } from 'react-native-paper';
import { COLORS } from './constants/colors';

export const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: '#ffffff',
    error: COLORS.danger
  }
};
