import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{
      padding: '40px',
      color: '#FFFFFF',
      background: '#080c14',
      height: '100vh',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#00B0FF' }}>Admin Micro Frontend</h1>
      <p style={{ color: '#9AA0A6' }}>This is a remote module of MoneyAnalyze containing user list, global settings, bot settings, and stock management. It is consumed by the Host Shell at runtime.</p>
    </div>
  </React.StrictMode>
);
