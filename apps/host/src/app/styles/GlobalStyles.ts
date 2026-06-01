import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
    max-width: 100vw;
    background-color: ${props => props.theme.colors.white || '#FFFFFF'};
    color: ${props => props.theme.colors.textMain || '#202124'};
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
    font-size: 12.8px;
  }

  #root {
    height: 100%;
    overflow-x: hidden;
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Scrollbar Customization */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.white || '#FFFFFF'};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.surfaceHover || '#F8F9FA'};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.border || '#DADCE0'};
  }
`;