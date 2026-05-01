import styled from 'styled-components';

export const MarketModeButton = styled.button<{ $active: boolean; $color?: string }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid;
  border-color: ${props => props.$active
    ? (props.$color || '#1a73e8')
    : '#dadce0'};
  background: ${props => props.$active
    ? (props.$color === '#f4b400'
      ? 'rgba(244, 180, 0, 0.05)'
      : 'rgba(26, 115, 232, 0.05)')
    : 'transparent'};
  color: ${props => props.$active
    ? (props.$color || '#1a73e8')
    : '#5f6368'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: ${props => props.$color || '#1a73e8'};
  }
`;

export const MarketModeContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TradingModeContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SectionHeaderBorderless = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 0;
  border-bottom: none;
`;

export const Divider = styled.div`
  margin: 24px 0;
  border-top: 1px dashed #dadce0;
`;

export const TradingModeButton = styled.button<{ $isSimulation: boolean; $isLive: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid;
  border-color: ${props => {
    if (props.$isLive) return '#159d58';
    if (props.$isSimulation) return '#1a73e8';
    return '#dadce0';
  }};
  background: ${props => {
    if (props.$isLive) return 'rgba(15, 157, 88, 0.05)';
    if (props.$isSimulation) return 'rgba(26, 115, 232, 0.05)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$isLive) return '#159d58';
    if (props.$isSimulation) return '#1a73e8';
    return '#5f6368';
  }};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const TradingModeHint = styled.div<{ $isLive: boolean }>`
  color: ${props => props.$isLive ? '#db4437' : '#5f6368'};
  font-weight: ${props => props.$isLive ? '600' : '400'};
`;

export const AIAutomationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AutomationSection = styled.div``;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #202124;
  margin-bottom: 4px;
  margin-top: 0;
`;

export const SectionNote = styled.p`
  font-size: 0.8125rem;
  color: #5f6368;
  line-height: 1.4;
  margin: 0;
`;

export const AutomationButton = styled.button<{ $color: string; $disabled: boolean }>`
  background: ${props => props.$disabled ? '#dadce0' : props.$color};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: ${props => props.$disabled
    ? 'none'
    : `0 4px 10px ${props.$color}4d`};

  &:hover {
    opacity: ${props => props.$disabled ? 1 : 0.9};
  }
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #5f6368;
  margin-bottom: 6px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #f1f3f4;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ $percent: number; $color: string }>`
  width: ${props => props.$percent}%;
  height: 100%;
  background: ${props => props.$color};
  transition: width 0.4s ease;
`;

export const GradientProgressBar = styled(ProgressBar)`
  background: ${props =>
    props.$color === '#a76bf5'
      ? 'linear-gradient(90deg, #A76BF5, #1A73E8)'
      : 'linear-gradient(90deg, #0F9D58, #1A73E8)'};
`;

export const ProgressSection = styled.div``;

export const APIWarningHint = styled.div`
  margin-top: 20px;
  font-size: 0.8125rem;
  color: #f4b400;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    
    button {
      width: 100%;
      margin-top: 0;
    }
  }
`;

export const ResetButton = styled.button`
  background: transparent;
  color: #db4437;
  border: 1px solid #db4437;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(219, 68, 55, 0.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
