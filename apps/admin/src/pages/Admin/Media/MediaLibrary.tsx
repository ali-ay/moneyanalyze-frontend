import { useState, useEffect, useRef } from 'react';
import * as S from './MediaLibrary.styles';
import api from '../../../services/apiClient';
import { 
  Upload, Copy, Trash2, Image as ImageIcon, 
  Check, AlertCircle, Loader2 
} from 'lucide-react';
import { 
  PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState 
} from '../../../components/ui/Layout.styles';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await api.get('/admin/media-library');
      if (res.data.success) {
        setMedia(res.data.data);
      }
    } catch (err) {
      console.error('Media fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/media-library/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setMedia(prev => [res.data.data, ...prev]);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Yükleme başarısız oldu.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;

    try {
      await api.delete(`/admin/media-library/${id}`);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <LoadingState>Medya Kütüphanesi Yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Medya Kütüphanesi</PageTitle>
        <PageSubtitle>Görsellerinizi yükleyin, yönetin ve linklerini kopyalayın.</PageSubtitle>
      </PageHeader>

      <S.UploadArea onClick={() => fileInputRef.current?.click()}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*"
        />
        <S.UploadIcon>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        </S.UploadIcon>
        <h3>{uploading ? 'Dosya Yükleniyor...' : 'Dosya Yüklemek İçin Tıklayın veya Sürükleyin'}</h3>
        <p>Sadece JPG, PNG, GIF, WEBP (Maks. 5MB)</p>
      </S.UploadArea>

      <S.MediaGrid>
        {media.map((item) => (
          <S.MediaCard key={item.id}>
            {copiedId === item.id && <S.CopyBadge>Link Kopyalandı!</S.CopyBadge>}
            <S.ImageWrapper>
              <img src={item.url} alt={item.filename} />
            </S.ImageWrapper>
            <S.MediaInfo>
              <S.MediaTitle title={item.filename}>{item.filename}</S.MediaTitle>
              <div style={{ fontSize: '10px', opacity: 0.5, color: '#999' }}>
                {formatSize(item.size)}
              </div>
              <S.ActionButtons>
                <S.IconButton 
                  onClick={() => copyToClipboard(item.url, item.id)}
                  title="Link Kopyala"
                >
                  <Copy />
                </S.IconButton>
                <S.IconButton 
                  $variant="danger" 
                  onClick={() => handleDelete(item.id)}
                  title="Sil"
                >
                  <Trash2 />
                </S.IconButton>
              </S.ActionButtons>
            </S.MediaInfo>
          </S.MediaCard>
        ))}
      </S.MediaGrid>

      {media.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
          <ImageIcon size={48} style={{ marginBottom: '16px' }} />
          <p>Henüz hiç medya dosyası yüklenmemiş.</p>
        </div>
      )}
    </PageContainer>
  );
};

export default MediaLibrary;
