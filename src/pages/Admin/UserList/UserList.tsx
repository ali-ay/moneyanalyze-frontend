import { useEffect, useState } from 'react';
import * as S from './UserList.styles';
import { getAllUsers, updateUser, deleteUser } from '../../../services/admin.api'; 
import { Trash2, RefreshCcw, CheckCircle, XCircle, Eye } from 'lucide-react';
import UserDetailModal from './UserDetailModal';
import { PageContainer, PageHeader, PageTitle, PageSubtitle } from '../../../components/ui/Layout.styles';

interface User {
  id: string;
  username: string;
  role: string;
  status: string;
  isApproved: boolean;
  createdAt: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || []); 
    } catch (err) {
      console.error("Liste yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (userId: string, data: any) => {
    try {
      await updateUser(userId, data);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    } catch (err) {
      alert("Güncelleme başarısız.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert("Silme işlemi başarısız.");
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <PageTitle>Kullanıcı Yönetimi</PageTitle>
            <PageSubtitle>Sistemdeki tüm kullanıcıları görüntüleyin, yetkilerini ve hesap durumlarını yönetin.</PageSubtitle>
          </div>
          <S.RefreshButton onClick={fetchUsers} disabled={loading}>
            <RefreshCcw size={18} /> {loading ? 'Yükleniyor...' : 'Listeyi Yenile'}
          </S.RefreshButton>
        </div>
      </PageHeader>

      <S.TableWrapper>
        <S.Table>
          <thead>
            <tr>
              <S.Th>Kullanıcı Adı</S.Th>
              <S.Th>Onay Durumu</S.Th>
              <S.Th>Hesap Durumu</S.Th>
              <S.Th>Kayıt Tarihi</S.Th>
              <S.Th>Rol</S.Th>
              <S.Th style={{ textAlign: 'center' }}>İşlemler</S.Th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <S.Tr key={user.id}>
                  <S.Td>
                    <div style={{ fontWeight: 600 }}>{user.username}</div>
                  </S.Td>
                  <S.Td>
                    <button 
                      onClick={() => handleUpdate(user.id, { isApproved: !user.isApproved })}
                      style={{
                        background: user.isApproved ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)',
                        border: '1px solid',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: user.isApproved ? '#0F9D58' : '#DB4437',
                        borderColor: user.isApproved ? 'rgba(15, 157, 88, 0.2)' : 'rgba(219, 68, 55, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {user.isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.isApproved ? 'Onaylı' : 'Onay Bekliyor'}
                    </button>
                  </S.Td>
                  <S.Td>
                    <S.RoleSelect 
                      value={user.status} 
                      onChange={(e) => handleUpdate(user.id, { status: e.target.value })}
                      style={{ 
                        color: user.status === 'BANNED' ? '#DB4437' : 'inherit',
                      }}
                    >
                      <option value="PENDING">BEKLEMEDE</option>
                      <option value="ACTIVE">AKTİF</option>
                      <option value="BANNED">YASAKLI</option>
                    </S.RoleSelect>
                  </S.Td>
                  <S.Td>
                    <span style={{ color: '#888' }}>
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </S.Td>
                  <S.Td>
                    <S.RoleSelect 
                      value={user.role} 
                      onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODERATOR">MODERATOR</option>
                    </S.RoleSelect>
                  </S.Td>
                  <S.Td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <S.ActionButton $type="detail" onClick={() => setSelectedUserId(user.id)} title="Detaylar">
                        <Eye size={18} />
                      </S.ActionButton>
                      <S.ActionButton $type="delete" onClick={() => handleDelete(user.id)} title="Kullanıcıyı Sil">
                        <Trash2 size={18} />
                      </S.ActionButton>
                    </div>
                  </S.Td>
                </S.Tr>
              ))
            ) : (
              <S.Tr>
                <S.Td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                   {loading ? 'Kullanıcı listesi yükleniyor...' : 'Gösterilecek kullanıcı bulunamadı.'}
                </S.Td>
              </S.Tr>
            )}
          </tbody>
        </S.Table>
      </S.TableWrapper>

      {selectedUserId && (
        <UserDetailModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </PageContainer>
  );
};

export default UserList;