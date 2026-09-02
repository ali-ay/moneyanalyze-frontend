import { useEffect, useState, useCallback } from 'react';
import * as S from './SystemStatus.styles';
import api from '../../../services/apiClient';
import {
  PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState
} from '../../../components/ui/Layout.styles';
import {
  Server, Laptop, Database, Activity, RefreshCw, Cpu, HardDrive, Clock, Terminal, Pencil, Check, X
} from 'lucide-react';

interface SystemStatusData {
  server: {
    status: string;
    uptime: number;
    platform: string;
    arch: string;
    cpuCount: number;
    cpuLoad: number[];
    memory: {
      total: number;
      free: number;
      used: number;
      percent: number;
      processRss?: number;
      processHeap?: number;
    };
    nodeVersion: string;
  };
  database: {
    status: string;
    latency: number;
  };
  redis: {
    status: string;
    latency: number;
  };
  macbookAir: {
    status: string;
    url?: string;
    latency: number;
    lastSync: string | null;
  };
}

const SystemStatus = () => {
  const [data, setData] = useState<SystemStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // URL düzenleme state'leri
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const fetchStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/admin/system-status');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Sistem durumu alınamadı:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCountdown(10);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Otomatik yenileme sayacı ve tetikleyicisi
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchStatus();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, fetchStatus]);

  const handleStartEdit = () => {
    setUrlInput(data?.macbookAir?.url || 'http://100.86.92.14:8000');
    setUrlError('');
    setEditingUrl(true);
  };

  const handleCancelEdit = () => {
    setEditingUrl(false);
    setUrlError('');
  };

  const handleSaveUrl = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlError('URL boş olamaz.');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setUrlError('Geçerli bir URL girin. (örn: http://192.168.1.75:8000)');
      return;
    }

    setSavingUrl(true);
    setUrlError('');
    try {
      await api.put('/admin/settings', { priceServerUrl: trimmed });
      setEditingUrl(false);
      await fetchStatus(true);
    } catch (err: any) {
      setUrlError(err?.response?.data?.message || 'Kaydetme başarısız.');
    } finally {
      setSavingUrl(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}g`);
    if (h > 0) parts.push(`${h}sa`);
    if (m > 0) parts.push(`${m}dk`);
    parts.push(`${s}sn`);

    return parts.join(' ');
  };

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return 'Hiçbir zaman';
    const date = new Date(isoString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return <LoadingState>Sistem durumu yükleniyor...</LoadingState>;
  }

  const isMacbookOnline = data?.macbookAir?.status === 'ONLINE';
  const isDbOnline = data?.database?.status === 'ONLINE';
  const isRedisOnline = data?.redis?.status === 'ONLINE';

  return (
    <PageContainer>
      <PageHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <PageTitle>Sistem Durumu</PageTitle>
          <PageSubtitle>MacBook Air fiyat sunucusu ve uygulama sunucusunun çalışma durumunu anlık izleyin.</PageSubtitle>
        </div>
        <S.HeaderActions>
          <S.AutoRefreshIndicator>
            {countdown} saniye içinde yenilenecek
          </S.AutoRefreshIndicator>
          <S.RefreshButton
            onClick={() => fetchStatus(true)}
            disabled={refreshing}
            $isRefreshing={refreshing}
          >
            <RefreshCw size={16} />
            Yenile
          </S.RefreshButton>
        </S.HeaderActions>
      </PageHeader>

      <S.StatusGrid>
        {/* Macbook Air Card */}
        <S.ServiceCard>
          <S.ServiceHeader>
            <S.ServiceInfo>
              <S.ServiceIconWrapper $isOnline={isMacbookOnline}>
                <Laptop size={22} />
              </S.ServiceIconWrapper>
              <S.ServiceName>
                <h4>MacBook Air (Local Price Server)</h4>
                <span>BIST veri sağlayıcı ve senkronizasyon cihazı</span>
              </S.ServiceName>
            </S.ServiceInfo>
            <S.StatusBadge $isOnline={isMacbookOnline}>
              <S.StatusDot $isOnline={isMacbookOnline} />
              {isMacbookOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            </S.StatusBadge>
          </S.ServiceHeader>

          <S.ServiceDetails>
            <S.DetailRow>
              <span className="label"><Clock size={16} /> Son Fiyat Güncellemesi</span>
              <span className="value">{formatDateTime(data?.macbookAir?.lastSync || null)}</span>
            </S.DetailRow>

            {/* Yerel Adres — inline edit */}
            <S.DetailRow>
              <span className="label"><Terminal size={16} /> Yerel Adres</span>
              <span className="value" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {editingUrl ? (
                  <S.UrlEditRow>
                    <S.UrlInput
                      autoFocus
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveUrl();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      placeholder="http://192.168.1.75:8000"
                    />
                    <S.UrlEditActions>
                      <S.SaveUrlButton onClick={handleSaveUrl} disabled={savingUrl}>
                        <Check size={14} />
                        {savingUrl ? 'Kaydediliyor…' : 'Kaydet'}
                      </S.SaveUrlButton>
                      <S.CancelUrlButton onClick={handleCancelEdit}>
                        <X size={14} />
                      </S.CancelUrlButton>
                    </S.UrlEditActions>
                  </S.UrlEditRow>
                ) : (
                  <>
                    <span style={{ fontFamily: 'monospace' }}>
                      {data?.macbookAir?.url || 'http://192.168.1.75:8000'}
                    </span>
                    <S.EditUrlTrigger onClick={handleStartEdit} title="Adresi düzenle">
                      <Pencil size={13} />
                    </S.EditUrlTrigger>
                  </>
                )}
              </span>
            </S.DetailRow>
            {urlError && (
              <div style={{ fontSize: '0.75rem', color: '#DB4437', textAlign: 'right', marginTop: '-8px' }}>
                {urlError}
              </div>
            )}

            <S.DetailRow>
              <span className="label"><Activity size={16} /> Yanıt Süresi</span>
              <span className="value">
                {isMacbookOnline ? (
                  <S.LatencyText $latency={data?.macbookAir?.latency || 0}>
                    {data?.macbookAir?.latency} ms
                  </S.LatencyText>
                ) : '-'}
              </span>
            </S.DetailRow>
          </S.ServiceDetails>
        </S.ServiceCard>

        {/* Database & Redis Card */}
        <S.ServiceCard>
          <S.ServiceHeader>
            <S.ServiceInfo>
              <S.ServiceIconWrapper $isOnline={isDbOnline && isRedisOnline}>
                <Database size={22} />
              </S.ServiceIconWrapper>
              <S.ServiceName>
                <h4>Veritabanı & Önbellek Servisleri</h4>
                <span>PostgreSQL ve Redis entegrasyonu</span>
              </S.ServiceName>
            </S.ServiceInfo>
            <S.StatusBadge $isOnline={isDbOnline && isRedisOnline}>
              <S.StatusDot $isOnline={isDbOnline && isRedisOnline} />
              {isDbOnline && isRedisOnline ? 'Sorunsuz' : 'Hata Var'}
            </S.StatusBadge>
          </S.ServiceHeader>

          <S.ServiceDetails>
            <S.DetailRow>
              <span className="label"><Database size={16} /> PostgreSQL Veritabanı</span>
              <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: isDbOnline ? '#0F9D58' : '#DB4437', fontWeight: 700 }}>
                  {isDbOnline ? 'AKTİF' : 'PASİF'}
                </span>
                {isDbOnline && (
                  <S.LatencyText $latency={data?.database?.latency || 0}>
                    ({data?.database?.latency} ms)
                  </S.LatencyText>
                )}
              </span>
            </S.DetailRow>
            <S.DetailRow>
              <span className="label"><Activity size={16} /> Redis Cache</span>
              <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: isRedisOnline ? '#0F9D58' : '#DB4437', fontWeight: 700 }}>
                  {isRedisOnline ? 'AKTİF' : 'PASİF'}
                </span>
                {isRedisOnline && (
                  <S.LatencyText $latency={data?.redis?.latency || 0}>
                    ({data?.redis?.latency} ms)
                  </S.LatencyText>
                )}
              </span>
            </S.DetailRow>
          </S.ServiceDetails>
        </S.ServiceCard>

        {/* Application Server Details */}
        {data?.server && (
          <S.ServerMetricsCard>
            <S.ServiceHeader>
              <S.ServiceInfo>
                <S.ServiceIconWrapper $isOnline={true}>
                  <Server size={22} />
                </S.ServiceIconWrapper>
                <S.ServiceName>
                  <h4>Uygulama Sunucusu Detayları</h4>
                  <span>MoneyAnalyze Node.js ana servis çalışma metrikleri</span>
                </S.ServiceName>
              </S.ServiceInfo>
              <S.StatusBadge $isOnline={true}>
                <S.StatusDot $isOnline={true} />
                Çevrimiçi
              </S.StatusBadge>
            </S.ServiceHeader>

            <S.MetricsGrid>
              <S.MetricItem>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#5F6368', fontWeight: 600 }}>
                  <Cpu size={16} /> CPU Yükü (Load Average)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: '#202124' }}>
                  {data.server.cpuLoad[0]?.toFixed(2) || '0.00'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9AA0A6' }}>
                  1 dk: {data.server.cpuLoad[0]?.toFixed(2)} | 5 dk: {data.server.cpuLoad[1]?.toFixed(2)} | 15 dk: {data.server.cpuLoad[2]?.toFixed(2)}
                </div>
              </S.MetricItem>

              <S.MetricItem>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#5F6368', fontWeight: 600 }}>
                  <HardDrive size={16} /> Uygulama RAM Tüketimi (Process)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: '#202124' }}>
                  {data.server.memory.processRss ? `${data.server.memory.processRss} MB` : `%${data.server.memory.percent}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9AA0A6' }}>
                  Sistem Toplamı: %{data.server.memory.percent} ({data.server.memory.used} MB / {data.server.memory.total} MB)
                </div>
              </S.MetricItem>

              <S.MetricItem>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#5F6368', fontWeight: 600 }}>
                  <Clock size={16} /> Sunucu Çalışma Süresi (Uptime)
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '6px', color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {formatUptime(data.server.uptime)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9AA0A6' }}>
                  Node.js: {data.server.nodeVersion}
                </div>
              </S.MetricItem>
            </S.MetricsGrid>

            <S.ProgressWrapper>
              <S.ProgressLabel>
                <span>RAM Tüketim Seviyesi</span>
                <span>%{data.server.memory.percent}</span>
              </S.ProgressLabel>
              <S.ProgressBar>
                <S.ProgressFill $percent={data.server.memory.percent} />
              </S.ProgressBar>
            </S.ProgressWrapper>

            <S.ServiceDetails style={{ marginTop: '8px', borderTop: '1px solid #DADCE040', paddingTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <S.DetailRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="label">İşletim Sistemi</span>
                  <span className="value" style={{ marginTop: '4px', textTransform: 'capitalize' }}>{data.server.platform} ({data.server.arch})</span>
                </S.DetailRow>
                <S.DetailRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="label">CPU Çekirdek Sayısı</span>
                  <span className="value" style={{ marginTop: '4px' }}>{data.server.cpuCount} Çekirdek</span>
                </S.DetailRow>
                <S.DetailRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="label">Node.js Çevre Sürümü</span>
                  <span className="value" style={{ marginTop: '4px', fontFamily: 'monospace' }}>{data.server.nodeVersion}</span>
                </S.DetailRow>
              </div>
            </S.ServiceDetails>
          </S.ServerMetricsCard>
        )}
      </S.StatusGrid>
    </PageContainer>
  );
};

export default SystemStatus;
