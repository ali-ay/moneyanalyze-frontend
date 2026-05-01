import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-weight: 800;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  font-size: 1.5rem;
`;

export const HeaderSubtitle = styled.p`
  margin: 4px 0 0;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.875rem;
`;

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchBox = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9AA0A6;
  }

  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border-radius: 8px;
    border: 1px solid #DADCE0;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #1A73E8;
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
    }

    &::placeholder {
      color: #9AA0A6;
    }
  }
`;

export const StockCountLabel = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const CardContent = styled.div`
  padding: 20px;
`;

export const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px;
    color: #5F6368;
    font-size: 0.75rem;
    border-bottom: 1px solid #F1F3F4;
    font-weight: 600;
    text-transform: uppercase;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #F1F3F4;
    font-size: 0.875rem;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }

  tr:hover {
    background-color: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  }
`;

export const TableHeaderCell = styled.th<{ $textAlign?: 'left' | 'center' | 'right' }>`
  text-align: ${props => props.$textAlign || 'left'};
`;

export const StockSymbol = styled.span`
  font-weight: 800;
  color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const CreatedAtCell = styled.td`
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.75rem;
`;

export const ActionCell = styled.td`
  text-align: right;
`;

export const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #E8EAED;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin: 0 -16px;
    padding: 0 16px;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #3C4043;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #DADCE0;
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
    }

    &::placeholder {
      color: #9AA0A6;
    }
  }
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;
