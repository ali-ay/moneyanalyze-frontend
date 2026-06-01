import type { DefaultTheme } from 'styled-components';

export const tokens = {
  colors: {
    primary: '#1A73E8',       // Google Blue
    primaryHover: '#174EA6',  // Google Blue Hover
    secondary: '#E8F0FE',     // Google Light Blue (Active bg)
    background: '#F8F9FA',    // Light Google Gray (Background)
    white: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHover: '#F8F9FA',
    border: '#DADCE0',
    textMain: '#202124',
    textSecondary: '#5F6368',
    success: '#0F9D58',
    danger: '#DB4437',
    warning: '#F4B400',
    glass: 'rgba(255, 255, 255, 0.8)',
    cardBg: '#FFFFFF',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(60,64,67,0.3)',
    sm: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
    md: '0 4px 20px rgba(0, 0, 0, 0.03)',
    lg: '0 8px 30px rgba(0, 0, 0, 0.05)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '999px',
  },
  // rem-based, %20 küçültülmüş ölçek (base 16px varsayımı)
  // Eski px karşılıkları: xs=4 sm=8 md=16 lg=24 xl=32 xxl=48
  // Rem (base 16): 0.25 / 0.5 / 1 / 1.5 / 2 / 3
  // %20 küçültme (×0.8): 0.2 / 0.4 / 0.8 / 1.2 / 1.6 / 2.4
  spacing: {
    xs: '0.2rem',
    sm: '0.4rem',
    md: '0.8rem',
    lg: '1.2rem',
    xl: '1.6rem',
    xxl: '2.4rem',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
  transitions: {
    default: 'all 0.3s ease-in-out',
    fast: 'all 0.15s ease-in-out',
  }
};

export const theme: DefaultTheme = {
  ...tokens,
  background: tokens.colors.background,
  text: tokens.colors.textMain,
};
