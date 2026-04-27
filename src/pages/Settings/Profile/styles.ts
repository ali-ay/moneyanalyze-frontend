import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

export const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
`;

export const Title = styled.h2`
  margin-bottom: 24px;
  color: #1a1a2e;
  font-size: 24px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
`;

export const InfoGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f9f9f9;

  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-weight: 600;
  color: #64748b;
`;

export const Value = styled.span`
  color: #1e293b;
  font-family: 'Inter', sans-serif;
`;

export const Badge = styled.span`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;