import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';

export interface StockHistoryItem {
  time: string;
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  rsi?: number;
  bb?: {
    upper: number;
    middle: number;
    lower: number;
  };
  macd?: {
    line: number;
    signal: number;
    histogram: number;
  };
}

// ─── TA Helpers ──────────────────────────────────────────

const getSMA = (prices: number[], period: number) => {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return parseFloat((sum / period).toFixed(2));
};

const getStdDev = (prices: number[], period: number) => {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / period;
  return Math.sqrt(variance);
};

const getEMA = (prices: number[], period: number) => {
  if (prices.length < period) return prices.map(() => 0);
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const emaArr = [ema];
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    emaArr.push(ema);
  }
  return emaArr;
};

const getRSI = (prices: number[], period: number = 14) => {
  if (prices.length <= period) return 50;
  const rsis: number[] = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) avgGain += diff;
    else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;
  rsis.push(100 - 100 / (1 + avgGain / (avgLoss || 1)));

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    rsis.push(100 - 100 / (1 + avgGain / (avgLoss || 1)));
  }
  return rsis;
};

// ─── Main Logic ──────────────────────────────────────────

export const useStockDetailLogic = (symbol?: string) => {
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [change, setChange] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'1d' | '5d' | '1mo' | '3mo' | '1y' | '5y' | 'all'>('1mo');
  const [fundamentals, setFundamentals] = useState<any>(null);
  const [indexHistory, setIndexHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    if (!symbol) return;

    setLoading(true);
    try {
      const cleanSymbol = symbol.replace('.IS', '');
      const infoRes = await apiClient.get(`/stock/info/${cleanSymbol}`);
      const quote = infoRes.data.quote;

      setFundamentals({
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.dividendYield,
        high52w: quote.fiftyTwoWeekHigh,
        low52w: quote.fiftyTwoWeekLow,
        name: quote.name
      });

      // Hisse geçmişi
      const response = await apiClient.get(`/stock/history/${cleanSymbol}?period=${timeframe}`);
      const data = response.data || [];
      
      // Endeks geçmişi (Karşılaştırma için)
      let indexData: any[] = [];
      try {
        const indexRes = await apiClient.get(`/stock/history/XU100?period=${timeframe}`);
        indexData = indexRes.data || [];
      } catch (e) {
        console.warn('Index data fetch failed');
      }

      if (data.length > 0) {
        const currentPrice = quote.price;
        const prices = data.map((d: any) => d.price);
        
        // Normalizasyon için başlangıç fiyatları
        const stockStart = data[0].price;
        const indexStart = indexData[0]?.price || 1;

        // TA Hesaplamaları... (same as before)
        const ma20Arr: (number|null)[] = data.map((_:any, i:number) => getSMA(prices.slice(0, i+1), 20));
        const ma50Arr: (number|null)[] = data.map((_:any, i:number) => getSMA(prices.slice(0, i+1), 50));
        const rsiArr = getRSI(prices, 14);
        
        const ema12 = getEMA(prices, 12);
        const ema26 = getEMA(prices, 26);
        const macdLine = ema12.map((e12, i) => {
          const offset = i - (ema12.length - ema26.length);
          return offset >= 0 ? e12 - ema26[offset] : 0;
        });
        const macdSignal = getEMA(macdLine, 9);

        const mappedData = data.map((item: any, i: number) => {
          const rsiVal = i >= 14 ? rsiArr[i - 14] : 50;
          const mLine = macdLine[i] || 0;
          const mSignal = i >= 9 ? macdSignal[i - (macdLine.length - macdSignal.length)] : 0;
          
          const currentPrices = prices.slice(0, i + 1);
          const sma20 = getSMA(currentPrices, 20);
          const stdDev = getStdDev(currentPrices, 20);
          
          // Endeks fiyatını bul (zaman eşlemesi ile)
          const indexPoint = indexData.find(id => id.time === item.time);

          return {
            time: item.time,
            date: item.date,
            price: item.price,
            open: item.open,
            high: item.high,
            low: item.low,
            volume: item.volume,
            ma20: sma20 || undefined,
            ma50: ma50Arr[i] || undefined,
            rsi: parseFloat((rsiVal || 0).toFixed(2)),
            // Yüzdesel değişim (Normalizasyon için)
            stockChange: parseFloat(((item.price - stockStart) / stockStart * 100).toFixed(2)),
            indexChange: indexPoint ? parseFloat(((indexPoint.price - indexStart) / indexStart * 100).toFixed(2)) : undefined,
            bb: (sma20 && stdDev) ? {
              upper: parseFloat((sma20 + (stdDev * 2)).toFixed(2)),
              middle: parseFloat(sma20.toFixed(2)),
              lower: parseFloat((sma20 - (stdDev * 2)).toFixed(2))
            } : undefined,
            macd: {
              line: parseFloat((mLine || 0).toFixed(4)),
              signal: parseFloat((mSignal || 0).toFixed(4)),
              histogram: parseFloat(((mLine || 0) - (mSignal || 0)).toFixed(4))
            }
          };
        });

        const lastItem = mappedData[mappedData.length - 1];
        const lastUpdatedDate = new Date(infoRes.data.lastUpdated);
        const livePoint = {
          time: timeframe === '1d' 
            ? lastUpdatedDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            : lastUpdatedDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
          date: infoRes.data.lastUpdated,
          price: parseFloat(currentPrice.toFixed(2)),
          open: lastItem?.open || currentPrice,
          high: Math.max(quote.high || currentPrice, currentPrice),
          low: Math.min(quote.low || currentPrice, currentPrice),
          volume: quote.volume || 0,
          ma20: lastItem?.ma20,
          ma50: lastItem?.ma50,
          rsi: lastItem?.rsi,
          bb: lastItem?.bb,
          macd: lastItem?.macd,
          stockChange: parseFloat(((currentPrice - stockStart) / stockStart * 100).toFixed(2)),
          indexChange: lastItem?.indexChange // Canlı endeks verisi yoksa sonuncuyu kullan
        };

        if (mappedData.length > 0 && mappedData[mappedData.length - 1].time === livePoint.time) {
          mappedData[mappedData.length - 1] = { ...mappedData[mappedData.length - 1], ...livePoint };
        } else {
          mappedData.push(livePoint);
        }

        setHistory(mappedData);
        setPrice(parseFloat(currentPrice.toFixed(2)));
        setChange(parseFloat(quote.changePercent.toFixed(2)));
        setChangePercent(parseFloat(quote.change.toFixed(2)));
        setLastUpdated(infoRes.data.lastUpdated);
      }
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const getTechnicalSummary = (last: StockHistoryItem) => {
    if (!last) return null;
    
    let score = 50; // Nötr
    const signals = [];

    // RSI Analizi
    if (last.rsi) {
      if (last.rsi < 30) { score += 20; signals.push('Aşırı Satım (Fırsat)'); }
      else if (last.rsi > 70) { score -= 20; signals.push('Aşırı Alım (Risk)'); }
      else if (last.rsi > 50) { score += 5; }
    }

    // MACD Analizi
    if (last.macd) {
      if (last.macd.histogram > 0) { score += 10; signals.push('Pozitif Momentum'); }
      else { score -= 10; signals.push('Negatif Momentum'); }
    }

    // MA Analizi
    if (last.ma20 && last.ma50) {
      if (last.price > last.ma20) { score += 10; signals.push('Kısa Vadeli Yükseliş'); }
      if (last.ma20 > last.ma50) { score += 5; signals.push('Trend Pozitif'); }
      if (last.price < last.ma20 && last.price < last.ma50) { score -= 15; signals.push('Düşüş Trendi'); }
    }

    let signal = 'NÖTR';
    let color = '#FFA000';
    if (score >= 70) { signal = 'GÜÇLÜ AL'; color = '#0F9D58'; }
    else if (score >= 60) { signal = 'AL'; color = '#0F9D58'; }
    else if (score <= 30) { signal = 'GÜÇLÜ SAT'; color = '#DB4437'; }
    else if (score <= 40) { signal = 'SAT'; color = '#DB4437'; }

    // Pivot Noktaları (Destek/Direnç)
    const p = (last.high + last.low + last.price) / 3;
    const pivots = {
      p: parseFloat(p.toFixed(2)),
      r1: parseFloat(((2 * p) - last.low).toFixed(2)),
      s1: parseFloat(((2 * p) - last.high).toFixed(2)),
      r2: parseFloat((p + (last.high - last.low)).toFixed(2)),
      s2: parseFloat((p - (last.high - last.low)).toFixed(2)),
    };

    return { signal, score: Math.min(Math.max(score, 0), 100), color, signals, pivots };
  };

  const technicalSummary = history.length > 0 ? getTechnicalSummary(history[history.length - 1]) : null;

  return { history, loading, price, changePercent, change, lastUpdated, timeframe, setTimeframe, technicalSummary, fundamentals };
};
