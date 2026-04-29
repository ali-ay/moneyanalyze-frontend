import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.api';
import { useAuth } from '../../../app/providers/AuthContext';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export const useLoginLogic = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let recaptchaToken = '';
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('login');
      }

      const response = await authService.login({ 
        email, 
        password, 
        recaptchaToken 
      });
      
      const token = response.data?.token;
      const user = response.data?.user;

      if (token && user) {
        login(user, token);
        navigate('/dashboard');
      } else {
        throw new Error('Giriş bilgileri eksik.');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || err.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    error, isLoading,
    handleLogin
  };
};