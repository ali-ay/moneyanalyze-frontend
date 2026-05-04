import styled from 'styled-components';

export const Container = styled.div`
  // Shared layout components handle the main padding
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const RefreshButton = styled.button`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TableWrapper = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border-radius: 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin: 0 -16px;
  padding: 0 16px;

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

  @media (min-width: 769px) {
    margin: 0;
    padding: 0;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 800px;
`;

export const Th = styled.th`
  padding: 18px 24px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

export const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMain || '#202124'};

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.8125rem;
  }
`;

export const Tr = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`;

export const ActionButton = styled.button<{ $type?: 'approve' | 'delete' | 'detail' }>`
  background: ${props => 
    props.$type === 'approve' ? 'rgba(15, 157, 88, 0.1)' : 
    props.$type === 'delete' ? 'rgba(219, 68, 55, 0.1)' : 
    props.$type === 'detail' ? 'rgba(26, 115, 232, 0.1)' : 
    'rgba(0,0,0,0.05)'
  };
  color: ${props => 
    props.$type === 'approve' ? (props.theme?.colors?.success || '#0F9D58') : 
    props.$type === 'delete' ? (props.theme?.colors?.danger || '#DB4437') : 
    props.$type === 'detail' ? (props.theme?.colors?.primary || '#1A73E8') : 
    '#5F6368'
  };
  border: 1px solid ${props => 
    props.$type === 'approve' ? 'rgba(15, 157, 88, 0.2)' : 
    props.$type === 'delete' ? 'rgba(219, 68, 55, 0.2)' : 
    props.$type === 'detail' ? 'rgba(26, 115, 232, 0.2)' : 
    'transparent'
  };
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: ${props => 
      props.$type === 'approve' ? 'rgba(15, 157, 88, 0.2)' : 
      props.$type === 'delete' ? 'rgba(219, 68, 55, 0.2)' : 
      props.$type === 'detail' ? 'rgba(26, 115, 232, 0.2)' : 
      'rgba(0,0,0,0.1)'
    };
  }
`;

export const RoleSelect = styled.select<{ $isBanned?: boolean }>`
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  color: ${props => props.$isBanned ? '#DB4437' : (props.theme?.colors?.textMain || '#202124')};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-size: 0.8125rem;
  font-weight: 600;

  &:focus {
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }

  option {
    background: ${props => props.theme?.colors?.white || '#FFFFFF'};
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const CenterAlignTh = styled(Th)`
  text-align: center;
`;

export const UsernameCell = styled.div`
  font-weight: 600;
`;

export const EmailCell = styled.div`
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.8125rem;
`;

export const ApprovalButton = styled.button<{ $isApproved: boolean }>`
  background: ${props =>
    props.$isApproved
      ? 'rgba(15, 157, 88, 0.1)'
      : 'rgba(219, 68, 55, 0.1)'
  };
  border: 1px solid ${props =>
    props.$isApproved
      ? 'rgba(15, 157, 88, 0.2)'
      : 'rgba(219, 68, 55, 0.2)'
  };
  border-radius: 20px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props =>
    props.$isApproved
      ? '#0F9D58'
      : '#DB4437'
  };
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const DateCell = styled.span`
  color: #888;
`;

export const ActionsCell = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const EmptyCell = styled(Td)`
  text-align: center;
  padding: 40px;
  color: #888;
`;