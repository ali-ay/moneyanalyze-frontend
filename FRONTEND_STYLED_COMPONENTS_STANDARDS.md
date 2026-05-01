# Frontend Styled-Components Standardları

## 📋 Genel Kural

**Hiçbir inline style olmayacak. Tüm stiller `.styles.ts` dosyalarında tanımlanacak.**

```tsx
// ❌ YANLIŞ
<div style={{ marginTop: '32px', display: 'flex' }}>

// ✅ DOĞRU
<S.ContainerWithMargin>
```

## 📁 Dosya Yapısı

Her sayfa için:
```
pages/Dashboard/
  ├── index.tsx              # Sayfanın kendisi (clean, sadece JSX)
  ├── Dashboard.styles.ts    # Tüm styled-components
  ├── logic.ts              # İş mantığı (hook'lar, utils)
  └── types.ts              # TypeScript tanımları (opsiyonel)
```

## 🎨 Styled-Components Yazma

### 1. Yapısı

```typescript
// Dashboard.styles.ts
import styled from 'styled-components';

// 1️⃣ Basit container'lar
export const DashboardGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

// 2️⃣ Şartlı stiller (props ile)
export const SectionRow = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$reverse ? '1fr 380px' : '380px 1fr'};
  gap: 18px;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

// 3️⃣ Renk/durum ile değişen stiller
export const StatusButton = styled.button<{ $status: 'active' | 'pending' | 'banned' }>`
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.success;
      case 'pending':
        return props.theme.colors.warning;
      case 'banned':
        return props.theme.colors.danger;
    }
  }};
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;
```

### 2. Props Kullanma

```typescript
// KURALLAR:
// 1. Şartlı stiller için props ekle
// 2. Props adlarının başına $ koş ($isActive, $type vb)
// 3. TypeScript type'ı açıkça belirt

export const Card = styled.div<{ $elevated?: boolean; $variant?: 'light' | 'dark' }>`
  padding: 16px;
  border-radius: 12px;
  background: ${props => 
    props.$variant === 'dark' 
      ? props.theme.colors.surfaceDark 
      : props.theme.colors.surface
  };
  box-shadow: ${props => 
    props.$elevated 
      ? '0 8px 24px rgba(0,0,0,0.12)' 
      : 'none'
  };
`;
```

### 3. Theme Kullanma

```typescript
// ✅ DOĞRU - theme'den renk al
export const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.radius.md};
`;

// ❌ YANLIŞ - hardcoded renk
export const Button = styled.button`
  background: #1A73E8;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
`;
```

## 📝 Component Yazma

### Temiz Index Sayfası

```typescript
// pages/Dashboard/index.tsx
import React from 'react';
import * as S from './Dashboard.styles';
import { useDashboardData } from './logic';
import { PortfolioSummary } from '../../features/dashboard/components/PortfolioSummary';

const DashboardPage: React.FC = () => {
  const { data, loading } = useDashboardData();

  return (
    <S.DashboardGrid>                    {/* Styled component */}
      <S.SectionRow>                     {/* Styled component */}
        <PortfolioSummary data={data} />
        <S.TrendSection>                {/* Styled container */}
          <TrendChart />
        </S.TrendSection>
      </S.SectionRow>
    </S.DashboardGrid>
  );
};

export default DashboardPage;
```

### ❌ YAPMAYACAKLARI

```tsx
// ❌ Inline style - BÜYÜK HATA
<div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>

// ❌ CSS classes - styled-components kullanıyoruz
<div className="dashboard-grid">

// ❌ className + inline style karışımı
<div className="card" style={{ marginTop: '16px' }}>
```

## 🔄 Refactoring Adımları

1. **Sayfayı aç** (örn: `Dashboard/index.tsx`)
2. **Tüm inline style'ları tespit et** (style={{ ... }})
3. **Yeni styled-components oluştur** (Dashboard.styles.ts'de)
4. **Inline style'ları styled-component'lerle değiştir**
5. **Import'ları güncelle** (`import * as S from './Dashboard.styles'`)

Örnek:
```tsx
// ÖNCE
<div style={{ marginTop: '32px', display: 'flex' }}>

// SONRA - styles dosyasına ekle
export const ContentWrapper = styled.div`
  margin-top: 32px;
  display: flex;
`;

// index.tsx'de kullan
<S.ContentWrapper>
```

## 📊 Checklist

- [ ] Tüm inline style'lar kaldırıldı
- [ ] Tüm .styles.ts dosyaları var
- [ ] Tüm props'lar $başında başlıyor
- [ ] Theme'den renkler kullanılıyor (hardcoded yok)
- [ ] @media queries .styles.ts'de
- [ ] Responsive tasarım kontrol edildi
- [ ] Dark mode test edildi

## 🎯 Sayfa Başına Yapılacaklar

### Priority 1 (En Yüksek)
- [ ] Admin (60 inline styles)
- [ ] Wallet (44 inline styles)
- [ ] StockDetail (27 inline styles)
- [ ] Settings (27 inline styles)

### Priority 2
- [ ] StockList (11 inline styles)
- [ ] StockActivity (11 inline styles)
- [ ] AIAnalysis (10 inline styles)

### Priority 3
- [ ] Bots (7 inline styles)
- [ ] Watchlist (6 inline styles)
- [ ] Auth (5 inline styles)
- [ ] CoinDetail (2 inline styles)
- [ ] Home (1 inline style)
- [ ] Dashboard (1 inline style) ✅ DONE

---

**Total: 211 inline style → 0**
