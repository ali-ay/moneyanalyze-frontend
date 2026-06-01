import * as S from './ScannerTable.styles';

interface Props {
  data: any[];
  onFollow: (symbol: string) => void;
  onBuy: (coin: any) => void; // Yeni prop ekledik
}

const ScannerTable = ({ data, onFollow, onBuy }: Props) => {
  return (
    <S.TableContainer>
      <S.Table>
        <thead>
          <tr>
            <S.Th>Durum</S.Th>
            <S.Th>Sembol</S.Th>
            <S.Th>Fiyat</S.Th>
            <S.Th>RSI</S.Th>
            <S.Th>Hacim</S.Th>
            <S.Th>Trend</S.Th>
            <S.Th>MACD</S.Th>
            <S.Th colSpan={2}>İşlemler</S.Th> {/* İki buton için genişlettik */}
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.symbol}>
              <S.Td>
                <S.Badge type={coin.totalScore >= 4 ? 'AL' : coin.totalSellScore >= 3 ? 'SAT' : 'NÖTR'}>
                  {coin.totalScore >= 5 ? '🌟 GÜÇLÜ' : 
                   coin.totalScore >= 4 ? '✅ AL' : 
                   coin.totalSellScore >= 3 ? '⚠️ SAT' : 'BEKLE'}
                  <span style={{ fontSize: '0.625rem', marginLeft: '5px' }}>({coin.totalScore}/6)</span>
                </S.Badge>
              </S.Td>
              <S.Td><strong>{coin.symbol}</strong></S.Td>
              <S.Td>$ {parseFloat(coin.price).toLocaleString()}</S.Td>
              <S.Td>
                <S.Badge type={coin.details.rsi.signal}>{coin.details.rsi.val}</S.Badge>
              </S.Td>
              <S.Td>
                <S.Badge type={coin.details.vol.signal}>x{coin.details.vol.val}</S.Badge>
              </S.Td>
              <S.Td>
                <S.Badge type={coin.details.trend.signal}>
                  {coin.details.trend.signal === 'AL' ? 'Yükseliş' : 'Düşüş'}
                </S.Badge>
              </S.Td>
              <S.Td>
                <S.Badge type={coin.details.macd.signal}>
                  {coin.details.macd.val}
                </S.Badge>
              </S.Td>
              <S.Td>
                <S.FollowBtn onClick={() => onFollow(coin.symbol)}>Takip Et</S.FollowBtn>
              </S.Td>
              <S.Td>
                {/* Fonksiyonun adını onBuy olarak düzelttik */}
                <S.BuyBtn onClick={() => onBuy(coin)}>AL</S.BuyBtn>
              </S.Td>
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.TableContainer>
  );
};

export default ScannerTable;