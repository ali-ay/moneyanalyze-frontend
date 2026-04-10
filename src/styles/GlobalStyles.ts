import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #0f172a; /* Koyu modern lacivert/siyah */
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    transition: 0.3s;
  }

  input {
    outline: none;
  }
`;