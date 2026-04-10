import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #334155;
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Td = styled.td`
  padding: 16px;
  border-top: 1px solid #334155;
  color: #f8fafc;
  font-size: 14px;
  font-family: 'JetBrains Mono', monospace;
`;

export const Badge = styled.div<{ type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  
  background: ${props => 
    props.type === 'AL' ? 'rgba(16, 185, 129, 0.1)' : 
    props.type === 'SAT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(148, 163, 184, 0.05)'};
    
  color: ${props => 
    props.type === 'AL' ? '#10b981' : 
    props.type === 'SAT' ? '#ef4444' : '#94a3b8'};
    
  border: 1px solid ${props => 
    props.type === 'AL' ? '#10b981' : 
    props.type === 'SAT' ? '#ef4444' : '#334155'};
`;

export const FollowBtn = styled.button`
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #7dd3fc;
    transform: translateY(-1px);
  }
`;

export const BuyBtn = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #059669;
  }
`;