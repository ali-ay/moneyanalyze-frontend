import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const fixFederationCssBug = () => ({
  name: 'fix-federation-css-bug',
  enforce: 'post' as const,
  generateBundle(options: any, bundle: any) {
    Object.keys(bundle).forEach((fileName) => {
      if (fileName.includes('remoteEntry.js')) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          chunk.code = chunk.code.replace(/([`"'])__v__css__[^`"']+\1/g, '[]');
        }
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
  plugins: [
    fixFederationCssBug(),
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
        './SystemStatus': './src/pages/Admin/SystemStatus/SystemStatus',
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
    cssCodeSplit: false
  },
  server: {
    port: 3003,
    strictPort: true
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    }
  }
  };
});
