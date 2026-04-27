import styled from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  margin-bottom: 30px;
  color: #1e293b;
`;

export const SettingsSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 12px;
  font-size: 18px;
`;

export const Description = styled.p`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;

  label {
    font-size: 14px;
    font-weight: 500;
  }

  input {
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 16px;
  }
`;

export const SaveButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:hover { background: #2563eb; }
`;

export const DangerZone = styled(SettingsSection)`
  border: 1px solid #fee2e2;
  background: #fef2f2;
`;

export const ResetButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  &:hover { background: #dc2626; }
  &:disabled { background: #94a3b8; }
`;