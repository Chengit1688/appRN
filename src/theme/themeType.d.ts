import lightTheme from './light';

declare global {
  type ThemeColors = typeof lightTheme;
}
