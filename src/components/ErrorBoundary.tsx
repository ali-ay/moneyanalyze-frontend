import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Render sırasında atılan hataları yakalayıp uygulamanın komple çökmesini önler.
 * Üst seviye App'te ve isteğe göre kritik sayfalarda kullan.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('🔥 ErrorBoundary yakaladı:', error, info?.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          background: '#080c14',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Bir şeyler ters gitti</h1>
          <p style={{ color: '#9AA0A6', marginBottom: 24, lineHeight: 1.6 }}>
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilir veya tekrar giriş yapabilirsiniz.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              textAlign: 'left',
              background: '#11161f',
              padding: 12,
              borderRadius: 8,
              color: '#ff8a80',
              fontSize: 12,
              overflowX: 'auto',
              marginBottom: 16
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => { this.reset(); window.location.reload(); }}
            style={{
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
