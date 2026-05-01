import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      background: string;
      white: string;
      surface: string;
      surfaceHover: string;
      border: string;
      textMain: string;
      textSecondary: string;
      success: string;
      danger: string;
      warning: string;
      glass: string;
      cardBg: string;
    };
    shadows: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    transitions: {
      default: string;
      fast: string;
    };
    background: string;
    text: string;
  }
}
