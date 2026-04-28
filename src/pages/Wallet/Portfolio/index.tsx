import { useWalletLogic } from './logic';
import * as S from './styles';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../../components/ui/Layout.styles';
import { MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../../components/ui/Card.styles';
import { TableContainer, Table, Th, Td, TableRow } from '../../../components/ui/Table.styles';
import { Briefcase, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
const COLORS = ['#1a73e8', '#0f9d58', '#f4b400', '#db4437', '#673ab7', '#00bcd4', '#ff9800', '#795548'];

const MyPortfolio = () => {
  const {
    assets, livePrices, lastUpdates, loading, stats,
    balanceUSD,
    assetOnlyUSD, assetOnlyTRY,
    handleFastSell
  } = useWalletLogic();

  if (loading && assets.length === 0) return <LoadingState>Portföy Yükleniyor...</LoadingState>;

  // ... chartData logic ...

  // Grafiğe özel veri hazırlığı
  const chartData = assets.map(asset => {
    const currentPrice = livePrices[asset.symbol] || asset.averagePrice;
    return {
      name: asset.symbol,
      value: asset.amount * currentPrice
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Portföyüm</PageTitle>
        <PageSubtitle>Sahip olduğunuz tüm varlıkların anlık durumu ve kâr/zarar analizi.</PageSubtitle>
      </PageHeader>

      <S.PortfolioHeaderGrid>
        {/* Sol Kolon: Pasta Grafiği */}
        <S.ChartContainer>
          <CardHeader style={{ width: '100%', marginBottom: '20px' }}>
            <CardTitle>Varlık Dağılımı</CardTitle>
            <CardIcon $variant="primary">
              <PieChartIcon size={20} />
            </CardIcon>
          </CardHeader>

          {chartData.length > 0 ? (
            <div style={{ width: '100%', minHeight: '260px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', color: '#9AA0A6' }}>
              Veri bulunamadı.
            </div>
          )}
        </S.ChartContainer>

        {/* Sağ Kolon: İstatistik Kartları */}
        <S.StatsColumn>
          <MetricCard>
            <CardHeader>
              <CardTitle>Toplam Portföy Değeri</CardTitle>
              <CardIcon $variant="primary">
                <Briefcase size={20} />
              </CardIcon>
            </CardHeader>
            <CardValue>₺{assetOnlyTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardValue>
            <div style={{ color: '#9AA0A6', fontSize: '14px', marginTop: '4px' }}>
              ≈ ${assetOnlyUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span style={{ marginLeft: '12px', borderLeft: '1px solid #333', paddingLeft: '12px' }}>
                Nakit: ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </MetricCard>

          <MetricCard>
            <CardHeader>
              <CardTitle>Net Kâr / Zarar</CardTitle>
              <CardIcon $variant={stats.isProfit ? "success" : "danger"}>
                {stats.isProfit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </CardIcon>
            </CardHeader>
            <S.ProfitLossCard $isProfit={stats.isProfit}>
              <div className="profit-value">
                {stats.isProfit ? '+' : ''}${stats.profitLoss.toFixed(2)}
              </div>
              <div className="profit-percent">
                {stats.isProfit ? '▲' : '▼'} %{Math.abs(stats.profitPercent).toFixed(2)}
              </div>
            </S.ProfitLossCard>
          </MetricCard>
        </S.StatsColumn>
      </S.PortfolioHeaderGrid>

      {/* Masaüstü Tablo Görünümü */}
      <S.DesktopTableContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Varlık</Th>
                <Th>Miktar</Th>
                <Th>Ort. Maliyet</Th>
                <Th>Güncel Fiyat</Th>
                <Th>Kâr / Zarar (%)</Th>
                <Th>Son Güncelleme</Th>
                <Th style={{ textAlign: 'right' }}>İşlem</Th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const isStock = asset.originalSymbol.includes('.IS');
                const cleanSymbol = asset.symbol.replace('USDT', '');
                const currentPrice = asset.symbol === 'USDT' ? 1 : (livePrices[cleanSymbol] || asset.averagePrice);
                const isAssetProfit = currentPrice >= asset.averagePrice;
                const currency = isStock ? '₺' : '$';
                const lastUpdate = lastUpdates[cleanSymbol];

                return (
                  <TableRow key={asset.symbol}>
                    <Td style={{ fontWeight: 'bold' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {asset.symbol}
                        {isStock && <span style={{ fontSize: '10px', background: '#e8f0fe', color: '#1a73e8', padding: '2px 6px', borderRadius: '4px' }}>BIST</span>}
                      </div>
                    </Td>
                    <Td>{asset.amount.toFixed(isStock ? 2 : 4)}</Td>
                    <Td>{currency}{asset.averagePrice.toLocaleString()}</Td>
                    <Td>
                      <S.LivePrice key={`${asset.symbol}-${currentPrice}`}>
                        <S.LiveDot />
                        {currency}{currentPrice.toLocaleString()}
                      </S.LivePrice>
                    </Td>
                    <Td>
                      <S.PriceInfo $isProfit={isAssetProfit}>
                        <span className="profit" style={{ fontWeight: 700 }}>
                          {isAssetProfit ? '+' : ''}%{Math.abs(((currentPrice - asset.averagePrice) / asset.averagePrice) * 100).toFixed(2)}
                        </span>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>
                          {isAssetProfit ? '+' : ''}{currency}{(Math.abs(currentPrice - asset.averagePrice) * asset.amount).toFixed(2)}
                        </div>
                      </S.PriceInfo>
                    </Td>
                    <Td style={{ fontSize: '12px', color: '#5F6368' }}>
                      {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <S.SellButton onClick={() => handleFastSell(asset, currentPrice)}>
                        Hızlı Sat
                      </S.SellButton>
                    </Td>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      </S.DesktopTableContainer>

      {/* Mobil Kart Görünümü */}
      <S.MobileListContainer>
        {assets.map((asset) => {
          const currentPrice = livePrices[asset.symbol] || asset.averagePrice;
          const isAssetProfit = currentPrice >= asset.averagePrice;

          return (
            <S.MobileAssetCard key={asset.symbol}>
              <S.CardRow>
                <div>
                  <S.AssetName>{asset.symbol}</S.AssetName>
                  <S.AssetAmount>{asset.amount.toFixed(4)} adet</S.AssetAmount>
                </div>
                <S.LivePrice key={`mobile-${asset.symbol}-${currentPrice}`}>
                  <S.LiveDot />
                  ${currentPrice.toLocaleString()}
                </S.LivePrice>
              </S.CardRow>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }} />

              <S.CardRow>
                <div>
                  <S.CardLabel>Ort. Maliyet</S.CardLabel>
                  <S.CardValue>${asset.averagePrice.toFixed(2)}</S.CardValue>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <S.CardLabel>Kâr/Zarar</S.CardLabel>
                  <S.PriceInfo $isProfit={isAssetProfit}>
                    <span className="profit" style={{ fontSize: '14px' }}>
                      {isAssetProfit ? '+' : ''}%{Math.abs(((currentPrice - asset.averagePrice) / asset.averagePrice) * 100).toFixed(2)}
                    </span>
                  </S.PriceInfo>
                </div>
              </S.CardRow>

              <S.SellButton
                style={{ width: '100%', marginTop: '4px', padding: '12px' }}
                onClick={() => handleFastSell(asset, currentPrice)}
              >
                Hızlı Satış Yap
              </S.SellButton>
            </S.MobileAssetCard>
          );
        })}
      </S.MobileListContainer>

      {/* Boş Durum Kontrolü */}
      {assets.length === 0 && (
        <EmptyState>Henüz bir varlığınız bulunmuyor.</EmptyState>
      )}

    </PageContainer>
  );
};

export default MyPortfolio;