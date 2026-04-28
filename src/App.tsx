import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './app/styles/theme';
import { GlobalStyles } from './app/styles/GlobalStyles';
import { AdminRoute } from './routes/AdminRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AuthProvider } from './core/providers/AuthContext';
import { SettingsProvider, useSettings } from './core/providers/SettingsContext';
import { NotificationProvider } from './core/providers/NotificationContext';
import { MarketModeProvider } from './context/MarketModeContext';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layouts
const MainLayout = lazy(() => import('./app/layouts/MainLayout'));

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

// Protected Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WalletPortfolio = lazy(() => import('./pages/Wallet/Portfolio'));
const WalletBalance = lazy(() => import('./pages/Wallet/Balance'));
const WalletHistory = lazy(() => import('./pages/Wallet/TradeHistory'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Profile = lazy(() => import('./pages/Settings/Profile'));
const Bots = lazy(() => import('./pages/Bots'));
const CoinDetail = lazy(() => import('./pages/CoinDetail'));
const StockDetail = lazy(() => import('./pages/StockDetail'));
const StockList = lazy(() => import('./pages/StockList'));

// Admin Pages
const UserList = lazy(() => import('./pages/Admin/UserList/UserList'));
const GlobalSettings = lazy(() => import('./pages/Admin/Settings/GlobalSettings'));
const BotSettings = lazy(() => import('./pages/Admin/BotSettings'));
const StockManagement = lazy(() => import('./pages/Admin/StockManagement'));

const AppContent = () => {
  const { settings, loading } = useSettings();

  // Use a stable fallback key to prevent reCAPTCHA initialization errors
  const reCaptchaKey = settings?.recaptchaSiteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  // Settings hâlâ yükleniyor VE elimizde hiç settings yoksa bekleyelim.
  // (SettingsContext error halinde DEFAULT_SETTINGS atadığı için bu durumda
  // settings dolu gelir ve uygulama açılır.)
  if (loading && !settings) {
    return (
      <div style={{
        background: '#080c14',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: 'sans-serif'
      }}>
        MoneyAnalyze Yükleniyor...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
        <Helmet>
          <title>{settings?.siteTitle || 'MoneyAnalyze'}</title>
          <meta name="description" content={settings?.siteDescription || 'Crypto Analysis Platform'} />
        </Helmet>
        
        <Router>
          <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#9AA0A6' }}>Yükleniyor...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Unified Protected Routes (User & Admin) */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/wallet" element={<WalletPortfolio />} />
                <Route path="/dashboard/wallet/balance" element={<WalletBalance />} />
                <Route path="/dashboard/history" element={<WalletHistory />} />
                <Route path="/dashboard/coin/:symbol" element={<CoinDetail />} />
                <Route path="/dashboard/stock/:symbol" element={<StockDetail />} />
                <Route path="/stocks" element={<StockList />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bots" element={<Bots />} />
                
                {/* Admin Nested Routes inside MainLayout */}
                <Route path="/admin">
                  <Route path="userlist" element={<AdminRoute><UserList /></AdminRoute>} />
                  <Route path="settings" element={<AdminRoute><GlobalSettings /></AdminRoute>} />
                  <Route path="bot-settings" element={<AdminRoute><BotSettings /></AdminRoute>} />
                  <Route path="stocks" element={<AdminRoute><StockManagement /></AdminRoute>} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </GoogleReCaptchaProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SettingsProvider>
          <AuthProvider>
            <NotificationProvider>
              <MarketModeProvider>
                <AppContent />
              </MarketModeProvider>
            </NotificationProvider>
          </AuthProvider>
        </SettingsProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;