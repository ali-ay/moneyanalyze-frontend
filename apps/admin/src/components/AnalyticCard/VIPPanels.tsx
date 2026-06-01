import * as S from './VIPPanels.styles';

interface Props {
  data: any[];
}

const VIPPanels = ({ data }: Props) => {
  const strongBuys = data.filter(c => c.totalScore >= 4).slice(0, 5);
  const strongSells = data.filter(c => c.totalSellScore >= 3).slice(0, 5);

  return (
    <S.Grid>
      <S.Panel type="buy">
        <h3>🚀 Güçlü Alım Sinyalleri</h3>
        {strongBuys.map(c => <div key={c.symbol}>{c.symbol} - {c.totalScore}/6</div>)}
      </S.Panel>
      <S.Panel type="sell">
        <h3>⚠️ Kritik Satış Bölgesi</h3>
        {strongSells.map(c => <div key={c.symbol}>{c.symbol} - {c.totalSellScore}/6</div>)}
      </S.Panel>
    </S.Grid>
  );
};

export default VIPPanels;