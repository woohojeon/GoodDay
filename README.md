# 플리마켓 앱 🎪

QR 코드로 간편하게 주문할 수 있는 플리마켓 결제 시스템입니다.

## 주요 기능

- ✅ 상품 주문 및 장바구니 관리
- 💳 다양한 결제 연동 (KakaoPay, Toss, 데모 결제)
- 📊 실시간 판매 기록 및 DB 저장
- 👨‍💼 관리자 패널로 주문 관리
- 📱 모바일 최적화 UI
- 🏢 임시 사업자번호: 123-45-67890

## 기술 스택

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Payment**: KakaoPay API, Toss Payments SDK
- **Icons**: Lucide React

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행 (Frontend + Backend 동시 실행)
```bash
npm start
```

또는 개별 실행:
```bash
# Backend 서버 (포트 3001)
npm run server

# Frontend 개발 서버 (포트 5173)
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## API 엔드포인트

### 주문 관리
- `POST /api/orders` - 새 주문 생성
- `GET /api/orders` - 모든 주문 조회
- `GET /api/orders/:orderId` - 특정 주문 조회

### 결제 처리
- `POST /api/payments/kakao/ready` - KakaoPay 결제 준비
- `POST /api/payments/toss/ready` - Toss 결제 준비
- `POST /api/payments/demo` - 데모 결제 처리

## DB 스키마

### orders 테이블
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
```

### payments 테이블
```sql
CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);
```

## 결제 연동 설정

### KakaoPay
1. `server.js`에서 Admin Key 설정 필요
```javascript
const KAKAOPAY_CONFIG = {
  // Admin Key를 실제 키로 교체
  headers: {
    'Authorization': 'KakaoAK YOUR_ADMIN_KEY_HERE'
  }
};
```

### Toss Payments
1. 실제 서비스에서는 `TOSS_CONFIG`의 키를 실제 키로 교체
2. 현재는 테스트 키 사용

## 관리자 패널

`http://localhost:5173/admin` (구현 예정) - 현재는 AdminPanel 컴포넌트 직접 사용

## 주의사항

- 현재 임시 사업자번호 사용 중: `123-45-67890`
- 실제 서비스 시 결제사 API 키를 실제 키로 교체 필요
- SQLite DB는 `fleamarket.db` 파일에 저장됨
- CORS 설정으로 개발 환경에서만 동작

## 라이선스

MIT


<할 일>
1. 이름이랑 전화번호 결제 시 추가
2. sms 문자 보내기 기능 추가
3. 우측 상단 QR 삭제
