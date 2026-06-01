import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  color: white;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const HeaderContent = styled.div``;

export const HeaderTitle = styled.h2`
  margin: 0;
  color: white;
`;

export const HeaderSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 8px 0 0;
`;

export const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

export const EmptyMessage = styled.p`
  color: #475569;
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
`;

export const Card = styled.div`
  background-color: #1e293b;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: white;
`;

export const StrategyLabel = styled.span`
  font-size: 0.75rem;
  color: #10b981;
  text-transform: uppercase;
  font-weight: 600;
`;

export const StatusDot = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#10b981' : '#ef4444'};
  box-shadow: ${props => props.$isActive ? '0 0 10px #10b981' : 'none'};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 15px;
`;

export const InfoValue = styled.strong`
  color: #f1f5f9;
`;

export const Terminal = styled.div`
  background-color: #0f172a;
  border-radius: 8px;
  padding: 12px;
  height: 120px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #1e293b;
  font-family: monospace;
`;

export const LogText = styled.div`
  font-size: 0.6875rem;
  color: #34d399;
  margin-bottom: 4px;
  line-height: 1.4;
`;

export const LogTimestamp = styled.span`
  color: #475569;
`;

export const EmptyLog = styled.div`
  color: #475569;
  font-size: 0.6875rem;
`;

export const ActionButton = styled.button<{ $isActive: boolean }>`
  padding: 12px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s ease;
  background-color: ${props => props.$isActive ? '#ef4444' : '#3b82f6'};

  &:hover {
    opacity: 0.9;
  }
`;
