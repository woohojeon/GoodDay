import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Check, Coffee, Shirt, Gift, QrCode } from 'lucide-react';
import { PaymentModal } from './components/PaymentModal';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import './App.css';

import icetea from './assets/icetea.jpg';
import americano from './assets/aa.jpg';
import moru from './assets/moru.png';
import palzzi from './assets/palzzi.jpg';
import { createOrder } from './services/orderService'; // ✅ Supabase 저장

import type { Product, CartItem } from './types';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);

const PRODUCTS: Product[] = [
  { id: '1', name: '아이스티', price: 3500, image: icetea,    icon: <Coffee size={24} />, category: 'Beverages' },
  { id: '2', name: '아이스아메리카노', price: 3500, image: americano, icon: <Coffee size={24} />, category: 'Beverages' },
  { id: '4', name: '모루 인형',  price: 5900, image: moru,     icon: <Gift  size={24} />, category: 'Goods' },
  { id: '5', name: '수제 팔찌', price: 5900, image: palzzi,    icon: <Shirt size={24} />, category: 'Accessories' },
];

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const v = value instanceof Function ? value(storedValue) : value;
      setStoredValue(v);
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch (e) { console.error(e); }
  };
  return [storedValue, setValue] as const;
};

const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2600);
  };
  return { toasts, showToast };
};

const Toast: React.FC<{ toasts: Array<{ id: string; message: string; type: 'success' | 'error' }> }> = ({ toasts }) => (
  <div className="toast-stack">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.type === 'success' ? 'toast--success' : 'toast--error'}`}>{t.message}</div>
    ))}
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}> = ({ product, quantity, onUpdateQuantity }) => (
  <div className="product-card">
    <div className="product-card__media">
      {product.image ? (
        <img src={product.image} alt={product.name} className="product-card__img" />
      ) : (
        <div className="product-card__iconbox">{product.icon}</div>
      )}
    </div>

    <div className="product-card__body">
      <h3 className="product-card__title">{product.name}</h3>

      <div className="product-card__row">
        <div className="product-card__left">
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          {quantity > 0 && (
            <span className="product-card__qtytext">× {quantity}</span>
          )}
        </div>

        <div className="product-card__qty">
          {quantity > 0 && (
            <button
              onClick={() => onUpdateQuantity(product.id, Math.max(0, quantity - 1))}
              className="btn btn--qty"
              aria-label={`${product.name} 수량 감소`}
            >
              <Minus size={20} />
            </button>
          )}
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="btn btn--qty"
            aria-label={`${product.name} 담기`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SuccessModal: React.FC<{ isOpen: boolean; onClose: () => void; orderNumber: string; }>
= ({ isOpen, onClose, orderNumber }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="success-panel">
        <div className="success-panel__icon"><Check size={32} /></div>
        <h2 className="success-panel__title">Order Complete!</h2>
        <p className="text-muted">주문이 성공적으로 접수되었습니다.</p>
        <button onClick={onClose} className="btn btn--block btn--primary" style={{ marginTop: 16 }}>계속 쇼핑하기</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useLocalStorage<Record<string, number>>('fleamarket-cart', {});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { toasts, showToast } = useToast();

  const cartItems: CartItem[] = PRODUCTS
    .filter(product => (cart[product.id] || 0) > 0)
    .map(product => ({ ...product, quantity: cart[product.id] }));

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  };

  const handlePayClick = () => {
    if (totalItems === 0) {
      showToast('상품을 담아주세요.', 'error');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (method: 'kakao' | 'toss') => {
  try {
    console.log("=== 결제 시작 ===");
    console.log("cartItems:", cartItems);
    console.log("method:", method);
    
    const saved = await createOrder(cartItems, method);
    console.log("Supabase 저장 결과:", saved);
    console.log("saved 타입:", typeof saved);
    console.log("saved 길이:", saved?.length);
    
    if (!saved || saved.length === 0) {
      throw new Error("저장된 데이터가 없습니다");
    }

    setOrderNumber(saved[0].id); // order_items의 uuid
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
    setCart({});
  } catch (err) {
    console.error("=== 결제 에러 ===", err);
    showToast('주문 저장 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류'), 'error');
  }
};


  const handleSuccess = () => {
    setCart({});
    setIsSuccessOpen(false);
    showToast('새로운 주문을 시작합니다');
  };

  return (
    <div className="fm-page">
      <Toast toasts={toasts} />

      {/* Header */}
      <header className="fm-header">
        <div className="fm-header__inner">
          <div className="brand">
            <h1 className="brand__title">굿데이 일일찻집</h1>
            <p className="brand__tag">Good Day Pop-up Cafe</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setIsQROpen(true)} className="btn btn--icon" aria-label="QR 코드 열기">
              <QrCode size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="fm-main">
        <div className="product-grid">
          {PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <div className="bottom-cta__inner">
          <div className="bottom-cta__sum">
            <span className="sum-label">총액</span>
            <strong className="sum-value">{formatCurrency(totalAmount)}</strong>
          </div>
          <button
            onClick={handlePayClick}
            className="btn btn--gradient btn--lg"
            disabled={totalItems === 0}
            style={{ minWidth: 220 }}
          >
            <span className="btn__icon"><ShoppingCart size={18} /></span>
            결제하기 ({totalItems})
          </button>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalAmount}
        itemCount={totalItems}
        onSuccess={handlePaymentSuccess}
      />
      <SuccessModal isOpen={isSuccessOpen} onClose={handleSuccess} orderNumber={orderNumber} />
      <QRCodeDisplay isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
    </div>
  );
};

export default App;
