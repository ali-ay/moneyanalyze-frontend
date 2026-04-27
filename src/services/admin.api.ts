import axiosInstance from './apiClient';

// Tüm kullanıcıları getir (Onaylı/Onaysız ayrımı yapmadan)
export const getAllUsers = () => {
  const token = localStorage.getItem('token');
  return axiosInstance.get('/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Sadece onay bekleyenleri getir (Eski yapıyı desteklemek istersen)
export const getPendingUsers = () => axiosInstance.get('/admin/pending');

/**
 * Kullanıcıyı günceller (Hem onay hem de rol değişimi için)
 * @param userId - Güncellenecek kullanıcının ID'si
 * @param data - { role: 'ADMIN', isApproved: true } gibi güncellenecek alanlar
 */
export const updateUser = (userId: string, data: { role?: string; isApproved?: boolean }) => 
  axiosInstance.put(`/admin/users/${userId}`, data);

// Kullanıcı sil (URL yapısını backend'e göre temizledik)
export const deleteUser = (userId: string) => 
  axiosInstance.delete(`/admin/users/${userId}`);

// Kullanıcı detaylarını getir (Bakiye, Botlar, İşlemler vb.)
export const getUserDetail = (userId: string) =>
  axiosInstance.get(`/admin/users/${userId}/detail`);