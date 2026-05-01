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
        <S.HeaderContent>
          <div>
            <PageTitle>Kullanıcı Yönetimi</PageTitle>
            <PageSubtitle>Sistemdeki tüm kullanıcıları görüntüleyin, yetkilerini ve hesap durumlarını yönetin.</PageSubtitle>
          </div>
          <S.RefreshButton onClick={fetchUsers} disabled={loading}>
            <RefreshCcw size={18} /> {loading ? 'Yükleniyor...' : 'Listeyi Yenile'}
          </S.RefreshButton>
        </S.HeaderContent>
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
              <S.CenterAlignTh>İşlemler</S.CenterAlignTh>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <S.Tr key={user.id}>
                  <S.Td>
                    <S.UsernameCell>{user.username}</S.UsernameCell>
                  </S.Td>
                  <S.Td>
                    <S.ApprovalButton
                      $isApproved={user.isApproved}
                      onClick={() => handleUpdate(user.id, { isApproved: !user.isApproved })}
                    >
                      {user.isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.isApproved ? 'Onaylı' : 'Onay Bekliyor'}
                    </S.ApprovalButton>
                  </S.Td>
                  <S.Td>
                    <S.RoleSelect
                      $isBanned={user.status === 'BANNED'}
                      value={user.status}
                      onChange={(e) => handleUpdate(user.id, { status: e.target.value })}
                    >
                      <option value="PENDING">BEKLEMEDE</option>
                      <option value="ACTIVE">AKTİF</option>
                      <option value="BANNED">YASAKLI</option>
                    </S.RoleSelect>
                  </S.Td>
                  <S.Td>
                    <S.DateCell>
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </S.DateCell>
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
                    <S.ActionsCell>
                      <S.ActionButton $type="detail" onClick={() => setSelectedUserId(user.id)} title="Detaylar">
                        <Eye size={18} />
                      </S.ActionButton>
                      <S.ActionButton $type="delete" onClick={() => handleDelete(user.id)} title="Kullanıcıyı Sil">
                        <Trash2 size={18} />
                      </S.ActionButton>
                    </S.ActionsCell>
                  </S.Td>
                </S.Tr>
              ))
            ) : (
              <S.Tr>
                <S.EmptyCell colSpan={6}>
                   {loading ? 'Kullanıcı listesi yükleniyor...' : 'Gösterilecek kullanıcı bulunamadı.'}
                </S.EmptyCell>
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