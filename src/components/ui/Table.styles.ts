import styled, { keyframes, css } from 'styled-components';

export const TableContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  width: 100%;
  max-height: 700px;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.surfaceHover};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  
  thead {
    tr {
      border-bottom: 2px solid ${props => props.theme.colors.border};
    }
  }
`;

export const Th = styled.th`
  padding: 16px 15px;
  text-align: left;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
  
  &:first-child {
    padding-left: 24px;
  }
  
  &:last-child {
    padding-right: 24px;
  }
`;

const flashGreen = keyframes`
  0% { background-color: rgba(15, 157, 88, 0.15); }
  100% { background-color: transparent; }
`;

const flashRed = keyframes`
  0% { background-color: rgba(219, 68, 55, 0.15); }
  100% { background-color: transparent; }
`;

export const Td = styled.td<{ $flash?: 'up' | 'down' | null }>`
  padding: 16px 15px;
  font-size: 14px;
  color: ${props => props.theme.colors.textMain};
  font-weight: 500;
  vertical-align: middle;
  transition: background-color 0.3s ease;

  &:first-child {
    padding-left: 24px;
  }
  
  &:last-child {
    padding-right: 24px;
  }

  ${props => props.$flash === 'up' && css`
    animation: ${flashGreen} 1s ease-out;
    color: ${props.theme.colors.success};
  `}

  ${props => props.$flash === 'down' && css`
    animation: ${flashRed} 1s ease-out;
    color: ${props.theme.colors.danger};
  `}
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const Badge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${props => props.theme.radius.sm};
  font-size: 11px;
  font-weight: bold;
  
  background: ${props =>
    props.type === 'AL' || props.type === 'ALIM' || props.type === 'BUY' ? 'rgba(15, 157, 88, 0.1)' :
      props.type === 'SAT' || props.type === 'SATIM' || props.type === 'SELL' ? 'rgba(219, 68, 55, 0.1)' : '#F1F3F4'};
    
  color: ${props =>
    props.type === 'AL' || props.type === 'ALIM' || props.type === 'BUY' ? props.theme.colors.success :
      props.type === 'SAT' || props.type === 'SATIM' || props.type === 'SELL' ? props.theme.colors.danger : props.theme.colors.textSecondary};
    
  border: 1px solid ${props =>
    props.type === 'AL' || props.type === 'ALIM' || props.type === 'BUY' ? 'rgba(15, 157, 88, 0.2)' :
      props.type === 'SAT' || props.type === 'SATIM' || props.type === 'SELL' ? 'rgba(219, 68, 55, 0.2)' : '#DADCE0'};
`;
