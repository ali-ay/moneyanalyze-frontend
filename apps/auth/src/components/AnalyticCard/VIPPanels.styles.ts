import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div<{ type: 'buy' | 'sell' }>`
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.type === 'buy' ? '#10b981' : '#ef4444'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${props => props.type === 'buy' ? '#10b981' : '#ef4444'};
    margin-bottom: 15px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .coin-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #334155;
    color: #f8fafc;
    font-size: 0.875rem;

    &:last-child { border: none; }
    
    .score {
      font-weight: bold;
      color: #38bdf8;
    }
  }
`;