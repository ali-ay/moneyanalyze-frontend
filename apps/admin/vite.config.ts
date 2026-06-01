import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
  base: isProd ? '/admin/' : '/',
  plugins: [
    react(),
    federation({
      name: 'admin',
      filename: 'remoteEntry.js',
      remotes: {
        host: isProd ? '/assets/remoteEntry.js' : 'http://localhost:3000/assets/remoteEntry.js',
      },
      exposes: {
        './UserList': './src/pages/Admin/UserList/UserList',
        './GlobalSettings': './src/pages/Admin/Settings/GlobalSettings',
        './BotSettings': './src/pages/Admin/BotSettings',
        './StockManagement': './src/pages/Admin/StockManagement',
        './MediaLibrary': './src/pages/Admin/Media/MediaLibrary',
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
    port: 3003,
    strictPort: true
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: true
  }
  };
});
