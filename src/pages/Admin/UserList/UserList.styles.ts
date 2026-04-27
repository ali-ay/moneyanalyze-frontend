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
  font-size: 14px;
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
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const Th = styled.th`
  padding: 18px 24px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
`;

export const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  font-size: 14px;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
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

export const RoleSelect = styled.select`
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  font-size: 13px;
  font-weight: 600;

  &:focus {
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }

  option {
    background: ${props => props.theme?.colors?.white || '#FFFFFF'};
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }
`;