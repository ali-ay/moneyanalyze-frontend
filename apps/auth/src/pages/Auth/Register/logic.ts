import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.api';

export const useRegisterLogic = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authService.register(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        // Zod validation hataları
        setError(data.errors.map((e: any) => e.message).join(', '));
      } else {
        setError(data?.message || err.message || 'Kayıt sırasında bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    error,
    success,
    isLoading,
    handleRegister
  };
};