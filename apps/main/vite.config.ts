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
  const isProd = mode === 'production' && !process.env.VITE_LOCAL_DEV;
  const hostRemoteEntry = isProd
    ? '/assets/remoteEntry.js'
    : 'http://localhost:3000/assets/remoteEntry.js';
  return {
  plugins: [
    fixFederationCssBug(),
    react(),
    federation({
      name: 'main',
      filename: 'remoteEntry.js',
      // @ts-expect-error css option exists at runtime but is missing from type definitions
      css: false,
      remotes: {
        host: hostRemoteEntry,
      },
      exposes: {
        './Dashboard': './src/pages/Dashboard',
        './Home': './src/pages/Home',
        './Watchlist': './src/pages/Watchlist',
        './CoinDetail': './src/pages/CoinDetail',
        './StockDetail': './src/pages/StockDetail',
        './StockList': './src/pages/StockList',
        './StockActivity': './src/pages/StockActivity',
        './AIAnalysis': './src/pages/AIAnalysis',
        './Bots': './src/pages/Bots',
        './WalletPortfolio': './src/pages/Wallet/Portfolio',
        './WalletBalance': './src/pages/Wallet/Balance',
        './WalletHistory': './src/pages/Wallet/TradeHistory',
        './TrackingLog': './src/pages/Wallet/TrackingLog',
        './Profile': './src/pages/Settings/Profile',
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
    target: 'esnext'
  },
  server: {
    port: 3002,
    strictPort: true
  },
  preview: {
    port: 3002,
    strictPort: true,
    cors: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    }
  }
  };
});
