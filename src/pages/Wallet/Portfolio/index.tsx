import { useWalletLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../../components/ui/Layout.styles';
import { PortfolioPanel } from '../../../components/panels/PortfolioPanel';
import { AssetListPanel } from '../../../components/panels/AssetListPanel';
import { ChartContainer } from '../../../components/charts/ChartContainer';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#1a73e8', '#0f9d58', '#f4b400', '#db4437', '#673ab7', '#00bcd4', '#ff9800', '#795548'];

const MyPortfolio = () => {
  const {
    assets,
    livePrices,
    loading,
    stats,
    handleFastSell,
    sortConfig,
    requestSort,
    mode,
    currency,
  } = useWalletLogic();

  if (loading && assets.length === 0) {
    return <LoadingState>Portföy Yükleniyor...</LoadingState>;
  }

  const chartData = assets
    .map(asset => {
      const currentPrice = livePrices[asset.symbol] || asset.averagePrice;
      return {
        name: asset.symbol,
        value: asset.amount * currentPrice,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Portföyüm</PageTitle>
        <PageSubtitle>
          {mode === 'stock' ? 'BIST hisseleri' : 'Kripto varlıklar'} — anlık durum ve kâr/zarar analizi.
        </PageSubtitle>
      </PageHeader>

      <PortfolioPanel stats={stats} loading={loading} currency={currency} />

      <ChartContainer
        title="Varlık Dağılımı"
        isEmpty={chartData.length === 0}
        minHeight="320px"
      >
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
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `${currency}${Number(value).toFixed(2)}`}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <AssetListPanel
        assets={assets}
        livePrices={livePrices}
        loading={loading}
        sortConfig={sortConfig}
        onSort={requestSort}
        onSell={handleFastSell}
        currency={currency}
      />
    </PageContainer>
  );
};

export default MyPortfolio;
