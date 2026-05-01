import styled from 'styled-components';
import { Button } from '../../components/ui/Button';

export const BackButtonStyled = styled(Button)`
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
`;

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const BackButton = styled.button`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
`;

export const PageSubtitle = styled.p`
  margin: 4px 0 0;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.8125rem;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

export const ItemCount = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme?.colors?.danger || '#DB4437'};
  font-weight: 700;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const ActionCell = styled.td`
  text-align: right;
`;

export const HeaderCell = styled.th`
  text-align: right;

  &:first-child {
    text-align: left;
  }
`;
