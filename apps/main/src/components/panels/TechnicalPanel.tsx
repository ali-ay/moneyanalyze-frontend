import React from 'react';
import styled from 'styled-components';
import { Grid } from '../primitives/Grid';
import { IndicatorBadge, type IndicatorStatus } from '../metrics/IndicatorBadge';

const PanelContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0 0 ${props => props.theme.spacing?.lg || '24px'} 0;
`;

const IndicatorValue = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const IndicatorSection = styled.div`
  padding: ${props => props.theme.spacing?.md || '16px'};
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.radius.md};
`;

export interface TechnicalIndicators {
  rsi?: { value: number; level: string };
  macd?: { macd: number; signal: number; histogram: number };
  bb?: { upper: number; lower: number; middle: number };
  sma?: { sma20: number; sma50: number };
  ema?: { ema9: number; ema21: number };
}

export interface TechnicalPanelProps {
  indicators: TechnicalIndicators | null;
  signal?: 'strong-buy' | 'buy' | 'neutral' | 'sell' | 'strong-sell';
  score?: number;
  loading?: boolean;
}

const getSignalStatus = (signal?: string): IndicatorStatus => {
  switch (signal) {
    case 'strong-buy':
    case 'GÜÇLÜ_AL':
      return 'strong-buy';
    case 'buy':
    case 'AL':
      return 'buy';
    case 'sell':
    case 'SAT':
      return 'sell';
    case 'strong-sell':
    case 'GÜÇLÜ_SAT':
      return 'strong-sell';
    default:
      return 'neutral';
  }
};

export const TechnicalPanel: React.FC<TechnicalPanelProps> = ({
  indicators,
  signal,
  score,
  loading,
}) => {
  if (loading || !indicators) {
    return (
      <PanelContainer>
        <PanelTitle>Teknik Analiz</PanelTitle>
        <Grid $columns={2} $gap="md">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                height: '80px',
                background: '#f0f0f0',
                borderRadius: '12px',
                animation: 'pulse 2s infinite',
              }}
            />
          ))}
        </Grid>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <PanelTitle>Teknik Analiz</PanelTitle>

      {signal && (
        <div style={{ marginBottom: '20px' }}>
          <IndicatorBadge
            label="Genel Sinyal"
            status={getSignalStatus(signal)}
            value={score ? `${score}%` : undefined}
          />
        </div>
      )}

      <Grid $columns={2} $gap="md">
        {indicators.rsi && (
          <IndicatorSection>
            <div>RSI (14)</div>
            <IndicatorValue>{indicators.rsi.value.toFixed(2)}</IndicatorValue>
            <div style={{ fontSize: '0.75rem', color: '#9AA0A6', marginTop: '4px' }}>
              {indicators.rsi.level}
            </div>
          </IndicatorSection>
        )}

        {indicators.bb && (
          <IndicatorSection>
            <div>Bollinger Bands</div>
            <IndicatorValue>
              ↑ {indicators.bb.upper.toFixed(2)}
              <br />
              → {indicators.bb.middle.toFixed(2)}
              <br />↓ {indicators.bb.lower.toFixed(2)}
            </IndicatorValue>
          </IndicatorSection>
        )}

        {indicators.macd && (
          <IndicatorSection>
            <div>MACD</div>
            <IndicatorValue>
              MACD: {indicators.macd.macd.toFixed(4)}
              <br />
              Signal: {indicators.macd.signal.toFixed(4)}
              <br />
              Histogram: {indicators.macd.histogram.toFixed(4)}
            </IndicatorValue>
          </IndicatorSection>
        )}

        {indicators.sma && (
          <IndicatorSection>
            <div>SMA</div>
            <IndicatorValue>
              SMA(20): {indicators.sma.sma20.toFixed(2)}
              <br />
              SMA(50): {indicators.sma.sma50.toFixed(2)}
            </IndicatorValue>
          </IndicatorSection>
        )}

        {indicators.ema && (
          <IndicatorSection>
            <div>EMA</div>
            <IndicatorValue>
              EMA(9): {indicators.ema.ema9.toFixed(2)}
              <br />
              EMA(21): {indicators.ema.ema21.toFixed(2)}
            </IndicatorValue>
          </IndicatorSection>
        )}
      </Grid>
    </PanelContainer>
  );
};
