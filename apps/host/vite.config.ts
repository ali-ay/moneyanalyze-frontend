import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        auth: isProd ? '/auth/assets/remoteEntry.js' : 'http://localhost:3001/assets/remoteEntry.js',
        main: isProd ? '/main/assets/remoteEntry.js' : 'http://localhost:3002/assets/remoteEntry.js',
        admin: isProd ? '/admin/assets/remoteEntry.js' : 'http://localhost:3003/assets/remoteEntry.js',
      },
      exposes: {
        './AuthContext': './src/app/providers/AuthContext',
        './SettingsContext': './src/app/providers/SettingsContext',
        './NotificationContext': './src/app/providers/NotificationContext',
        './MarketModeContext': './src/context/MarketModeContext',
        './theme': './src/app/styles/theme',
        './GlobalStyles': './src/app/styles/GlobalStyles',
        './apiClient': './src/services/apiClient',
        './Button': './src/components/ui/Button',
        './Card': './src/components/ui/Card',
        './Input': './src/components/ui/Input',
        './Badge': './src/components/ui/Badge',
        './Switch': './src/components/ui/Switch',
        './Modal': './src/components/ui/Modal',
        './ErrorBoundary': './src/components/ErrorBoundary',
        './LoadingSpinner': './src/components/LoadingSpinner',
        './ProtectedRoute': './src/routes/ProtectedRoute',
        './AdminRoute': './src/routes/AdminRoute',
        './Navbar': './src/app/layouts/PublicLayout/Navbar/Navbar',
        './Footer': './src/app/layouts/PublicLayout/Footer/Footer',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'styled-components': { singleton: true },
        'react-router-dom': { singleton: true },
        'react-helmet-async': { singleton: true },
        'recharts': { singleton: true },
      } as any
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
  };
});
