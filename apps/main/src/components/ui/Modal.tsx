import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Container = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg};
  width: 100%;
  max-width: ${props => {
    switch (props.$size) {
      case 'sm': return '380px';
      case 'lg': return '720px';
      default: return '480px';
    }
  }};
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);
  animation: ${slideIn} 0.25s ease-out;
`;

const Header = styled.div`
  padding: ${props => props.theme.spacing?.lg || '24px'};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${props => props.theme.transitions?.default || 'all 0.2s ease'};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.textMain};
  }
`;

const Body = styled.div`
  padding: ${props => props.theme.spacing?.lg || '24px'};
`;

const Footer = styled.div`
  padding: ${props => props.theme.spacing?.lg || '24px'};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing?.sm || '8px'};
`;

export interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
}

export const Modal: React.FC<ModalProps> & {
  Body: typeof Body;
  Footer: typeof Footer;
} = ({
  isOpen = true,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={() => closeOnOverlay && onClose()}>
      <Container $size={size} onClick={e => e.stopPropagation()}>
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} type="button">
              <X size={20} />
            </CloseButton>
          </Header>
        )}
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Container>
    </Overlay>
  );
};

Modal.Body = Body;
Modal.Footer = Footer;
