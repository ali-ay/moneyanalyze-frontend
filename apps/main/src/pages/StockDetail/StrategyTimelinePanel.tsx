import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card } from '../../components/ui/Card';
import { History, ArrowRight, Calendar, GitCompare } from 'lucide-react';
import apiClient from '../../services/apiClient';

const TimelineContainer = styled.div`
  position: relative;
  margin-top: 20px;
  padding-left: 24px;
  
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 5px;
    bottom: 5px;
    width: 2px;
    background: ${props => props.theme.colors.border};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 24px;
  
  &::before {
    content: '';
    position: absolute;
    left: -21px;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.surface};
    z-index: 1;
  }
`;

const LogCard = styled.div`
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DateText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;

const ChangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
`;

const StrategyBadge = styled.span<{ $type: 'old' | 'new' }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8125rem;
  background: ${props => props.$type === 'old' ? 'rgba(255,255,255,0.05)' : props.theme.colors.primary + '20'};
  color: ${props => props.$type === 'old' ? props.theme.colors.textSecondary : props.theme.colors.primary};
  border: 1px solid ${props => props.$type === 'old' ? props.theme.colors.border : props.theme.colors.primary + '40'};
`;

const ReasonText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
  font-style: italic;
`;

interface Log {
  id: string;
  oldStrategy: string;
  newStrategy: string;
  reason: string;
  createdAt: string;
}

export const StrategyTimelinePanel: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/stock/strategy-change-log/${symbol}`);
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching strategy logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) return null;
  
  if (logs.length === 0) {
    return (
      <Card style={{ marginTop: '24px', opacity: 0.7 }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9AA0A6' }}>
            <History size={20} />
            <span style={{ fontSize: '0.875rem' }}>Bu hisse için henüz bir strateji değişimi kaydedilmedi. Strateji değiştikçe burada tarihsel bir akış oluşacaktır.</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: '24px' }}>
      <Card.Body>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <History size={20} color="#1A73E8" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Strateji Evrim Geçmişi</h3>
        </div>

        <TimelineContainer>
          {logs.map((log) => (
            <TimelineItem key={log.id}>
              <DateText>
                <Calendar size={12} />
                {new Date(log.createdAt).toLocaleString('tr-TR')}
              </DateText>
              <LogCard>
                <ChangeRow>
                  <StrategyBadge $type="old">{log.oldStrategy || 'Başlangıç'}</StrategyBadge>
                  <ArrowRight size={16} color="#9AA0A6" />
                  <StrategyBadge $type="new">{log.newStrategy}</StrategyBadge>
                </ChangeRow>
                {log.reason && (
                  <ReasonText>
                    <GitCompare size={10} style={{ marginRight: '4px' }} />
                    {log.reason}
                  </ReasonText>
                )}
              </LogCard>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </Card.Body>
    </Card>
  );
};
