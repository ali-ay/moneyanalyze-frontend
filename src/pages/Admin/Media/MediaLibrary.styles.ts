import styled from 'styled-components';

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

export const MediaCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const MediaInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MediaTitle = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const IconButton = styled.button<{ $variant?: 'danger' | 'primary' }>`
  background: ${({ $variant, theme }) => 
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(26, 115, 232, 0.1)'};
  color: ${({ $variant, theme }) => 
    $variant === 'danger' ? '#ef4444' : theme.colors.primary};
  border: 1px solid ${({ $variant, theme }) => 
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(26, 115, 232, 0.2)'};
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ $variant, theme }) => 
      $variant === 'danger' ? '#ef4444' : theme.colors.primary};
    color: white;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBg};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(26, 115, 232, 0.05);
  }

  input {
    display: none;
  }
`;

export const UploadIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
  svg {
    width: 48px;
    height: 48px;
  }
`;

export const CopyBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  animation: fadeInOut 1s ease-in-out;

  @keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
