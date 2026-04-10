// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Stil bileşenlerini ve temamızı içeri alıyoruz
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

// Önemli: Eğer varsa 'index.css' importunu buradan sildik 
// çünkü artık GlobalStyles kullanıyoruz.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ThemeProvider, uygulama içindeki tüm bileşenlerin 'theme' objesine erişmesini sağlar */}
    <ThemeProvider theme={theme}>
      {/* GlobalStyles, tarayıcı stillerini sıfırlar ve genel font/arkaplan ayarlarını yapar */}
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);