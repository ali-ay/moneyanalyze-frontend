import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
`;

export const PeriodTabsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px;
`;

export const OptimizationBox = styled.div`
  background: #E8F0FE;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(26, 115, 232, 0.2);
`;

export const OptimizationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const OptimizationBadge = styled.div`
  background: #1a73e8;
  border-radius: 50%;
  padding: 8px;
  color: white;
  display: flex;
`;

export const OptimizationInfo = styled.div``;

export const OptimizationLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  color: #1a73e8;
  text-transform: uppercase;
`;

export const OptimizationDetails = styled.div`
  font-size: 0.8125rem;
  color: #202124;
  font-weight: 600;
`;

export const OptimizationScore = styled.div`
  margin-left: auto;
  text-align: right;
`;

export const ScoreLabel = styled.div`
  font-size: 0.625rem;
  color: #5f6368;
  font-weight: 700;
`;

export const ScoreValue = styled.div`
  font-size: 1.125rem;
  font-weight: 900;
  color: #0f9d58;
`;

export const SaveSignalButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const DescriptionText = styled.div`
  font-size: 0.875rem;
  color: #5f6368;
  margin-bottom: 16px;
`;

export const StatValue = styled.div<{ $positive?: boolean }>`
  color: ${props => props.$positive ? '#0f9d58' : '#db4437'};
`;

export const SignalHistoryHeader = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #9aa0a6;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SignalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SignalProfit = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#0f9d58' : '#db4437'};
`;

export const SignalDescription = styled.div`
  font-size: 0.75rem;
  color: #5f6368;
  line-height: 1.4;
`;

export const ExpandButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  border: 1px dashed #dadce0;
  border-radius: 8px;
  color: #1a73e8;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;

  &:hover {
    background: #f8fbff;
    border-style: solid;
  }
`;

export const TooltipLabel = styled.div`
  font-weight: 800;
  margin-bottom: 4;
  color: #1a73e8;
`;

export const DisclaimerText = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  color: #db4437;
  font-weight: 600;
`;

export const NoDataContainer = styled.div`
  text-align: center;
  color: #9aa0a6;
  padding: 20px;
`;
