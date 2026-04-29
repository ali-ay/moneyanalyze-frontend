import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';

const FooterRow = styled.footer`
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusGroup = styled.div`
  display: flex;
  gap: 32px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  text-transform: uppercase;
  .indicator { 
    width: 6px; 
    height: 6px; 
    background: ${props => props.theme?.colors?.success || '#0F9D58'}; 
    border-radius: 50%; 
    box-shadow: 0 0 8px rgba(15, 157, 88, 0.4); 
  }
  svg { color: ${props => props.theme?.colors?.border || '#DADCE0'}; }
`;

export const DashboardFooter: React.FC<{ lastUpdated: string }> = ({ lastUpdated }) => {
  return (
    <FooterRow>
      <StatusGroup>
        <StatusItem><div className="indicator" /> SİSTEM DURUMU: <span>NORMAL</span></StatusItem>
        <StatusItem><Globe size={14} /> API GECİKMESİ: <span>14MS</span></StatusItem>
      </StatusGroup>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9AA0A6', textTransform: 'uppercase' }}>
        SON GÜNCELLEME: <span style={{ color: '#5F6368' }}>{lastUpdated}</span>
      </div>
    </FooterRow>
  );
};
