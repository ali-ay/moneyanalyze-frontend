import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');

/**
 * Auth event bus — interceptor'ın React state'e dolaylı haber vermesi için.
 * AuthProvider 'auth:unauthorized' event'ini dinleyip kullanıcıyı logout yapar.
 */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 sn — donmuş istekleri kes
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: Token'ı her isteğe otomatik ekle ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: 401 = oturum geçersiz, otomatik logout ---
let isUnauthorizedHandled = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const config = (error.config || {}) as AxiosRequestConfig & { _skipAuthRedirect?: boolean };

    // Public/login isteklerinde 401 = "şifre yanlış" gibi normal akış,
    // global logout tetikleme. Endpoint pattern'iyle filtrele.
    const url = config.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/settings/public');

    if (status === 401 && !isAuthEndpoint && !config._skipAuthRedirect) {
      if (!isUnauthorizedHandled) {
        isUnauthorizedHandled = true;
        // localStorage'ı temizle ve UI'a haber ver
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          localStorage.removeItem('id');
          localStorage.removeItem('userId');
          localStorage.removeItem('tradingMode');
        } catch { /* storage erişilemiyorsa sessizce geç */ }

        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT, {
          detail: { code: (error.response?.data as any)?.code, message: (error.response?.data as any)?.message }
        }));

        // Birden fazla 401 paralel gelirse tek redirect
        setTimeout(() => { isUnauthorizedHandled = false; }, 1500);
      }
    }

    // İstek timeout/network hatasıysa kullanıcı dostu mesaj ekle
    if (!error.response) {
      error.message = error.code === 'ECONNABORTED'
        ? 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
        : 'Sunucuya ulaşılamıyor. Bağlantınızı kontrol edin.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
