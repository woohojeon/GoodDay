import React, { useState } from 'react';
import { Plus, Minus, Coffee, Gift } from 'lucide-react';
import { PaymentModal } from './components/PaymentModal';

import type { Product, CartItem } from './types';

// Import images
import 아이스아메리카노 from './assets/음료_icon.jpg';
import 아이스티 from './assets/아이스티.jpg';
import 초코라떼 from './assets/초코라떼.jpg';
import 허브차 from './assets/허브차.jpg';
import 양말목 from './assets/양말목.jpg';
import 방향제 from './assets/방향제.jpg';
import 단추키링 from './assets/단추키링.jpg';
import 화분 from './assets/화분.jpg';

// Import icons
import 방향제_icon from './assets/방향제_icon.png';
import 단추키링_icon from './assets/단추키링_icon.png';
import 양말목_icon from './assets/양말목_icon.png';
import 화분_icon from './assets/화분_icon.png';
import 음료_icon from './assets/음료_icon.png';
import 세트_icon from './assets/세트.jpg';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '음료',
    price: 3500,
    image: 음료_icon,
    icon: <Coffee size={24} />,
    category: 'Beverages',
    description: '신선하게 준비한 다양한 음료를 만나보세요. 아이스 아메리카노, 아이스티, 초코라떼, 허브차 중 원하시는 음료를 선택하실 수 있습니다.',
    detailImages: [아이스아메리카노, 아이스티, 초코라떼, 허브차]
  },
  {
    id: '2',
    name: '양말목 네잎클로버 만들기',
    price: 3500,
    image: 양말목_icon,
    icon: <Gift size={24} />,
    category: 'DIY',
    description: '버려지는 양말목을 활용해 행운의 네잎클로버를 만들어보세요. 업사이클링을 통해 환경도 지키고 특별한 추억도 만들 수 있는 체험입니다.',
    detailImages: [양말목]
  },
  {
    id: '3',
    name: '리사이클링 방향제',
    price: 2500,
    image: 방향제_icon,
    icon: <Gift size={24} />,
    category: 'DIY',
    description: '커피박을 활용해 나만의 방향제를 만들어보세요. 버려지는 커피박을 재활용한 친환경 업사이클링 체험이며, 은은한 향기가 오래 지속됩니다.',
    detailImages: [방향제]
  },
  {
    id: '4',
    name: '단추키링 만들기',
    price: 4500,
    image: 단추키링_icon,
    icon: <Gift size={24} />,
    category: 'DIY',
    description: '사용하지 않는 단추를 새롭게 재탄생시켜 나만의 키링을 만들어보세요. 업사이클링의 가치를 담은 실용적인 소품입니다.',
    detailImages: [단추키링]
  },
  {
    id: '5',
    name: '나만의 화분 만들기',
    price: 2500,
    image: 화분_icon,
    icon: <Gift size={24} />,
    category: 'DIY',
    description: '귀여운 미니 화분을 직접 꾸며보세요. 작은 식물을 키우는 즐거움을 경험할 수 있습니다.',
    detailImages: [화분]
  },
  {
    id: '6',
    name: '양말목 & 방향제 & 단추키링',
    price: 10000,
    image: 세트_icon,
    icon: <Gift size={24} />,
    category: 'Set',
    description: '커피박 방향제, 양말목 네잎클로버, 단추키링을 모두 만들 수 있는 풀 패키지 세트입니다. 버려지는 소재들을 활용한 업사이클링의 가치를 경험하며 알뜰하게 즐길 수 있습니다.',
    detailImages: [방향제, 양말목, 단추키링]
  },
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
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }}>
    {toasts.map(t => (
      <div 
        key={t.id}
        style={{
          backgroundColor: t.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {t.message}
      </div>
    ))}
  </div>
);

const ProductCard: React.FC<{
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}> = ({ product, quantity, onUpdateQuantity }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }}>
    {product.image && (
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '8px',
          flexShrink: 0
        }}
      />
    )}
    <div style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignSelf: 'stretch'
    }}>
      <div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 4px 0'
        }}>
          {product.name}
        </h3>
        <p style={{
          fontSize: '16px',
          fontWeight: '500',
          color: '#6b7280',
          margin: 0
        }}>
          {product.price.toLocaleString()}원
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {quantity > 0 && (
            <button
              style={{
                borderRadius: '50%',
                border: '1px solid #d1d5db',
                padding: '4px',
                color: '#4b5563',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                transition: 'background-color 0.2s'
              }}
              onClick={() => onUpdateQuantity(product.id, Math.max(0, quantity - 1))}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <Minus size={18} />
            </button>
          )}
          <span style={{
            width: '32px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: '#374151'
          }}>
            {quantity}
          </span>
          <button
            style={{
              borderRadius: '50%',
              border: '1px solid #d1d5db',
              padding: '4px',
              color: '#4b5563',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  const [cart, setCart] = useLocalStorage<Record<string, number>>('fleamarket-cart', {});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
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

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setCart({});
    showToast('주문이 완료되었습니다!');
  };


  return (
    <div style={{
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      maxWidth: '100%',
      flexDirection: 'column',
      backgroundColor: 'white',
      fontFamily: 'Manrope, "Noto Sans", sans-serif'
    }}>
      <Toast toasts={toasts} />

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        padding: '16px'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}>
          🍀 굿데이 일일찻집
        </h1>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* 세트 메뉴 섹션 */}
          <div>
            <h2 style={{
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#000'
            }}>
              세트 메뉴
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {PRODUCTS.filter(p => p.category === 'Set').map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

          {/* 음료 섹션 */}
          <div>
            <h2 style={{
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#000'
            }}>
              음료
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {PRODUCTS.filter(p => p.category === 'Beverages').map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

          {/* DIY 만들기 체험 섹션 */}
          <div>
            <h2 style={{
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#000'
            }}>
              DIY 만들기 체험
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {PRODUCTS.filter(p => p.category === 'DIY').map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer - 결제 영역 */}
      <footer style={{
        position: 'sticky',
        bottom: 0,
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '16px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#4b5563',
            margin: 0
          }}>
            총 금액:
          </p>
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {totalAmount.toLocaleString()}원
          </p>
        </div>
        <button 
          onClick={handlePayClick}
          disabled={totalItems === 0}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '8px',
            backgroundColor: totalItems === 0 ? '#9ca3af' : '#1380ec',
            padding: '14px',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            border: 'none',
            cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
            boxShadow: totalItems === 0 ? 'none' : '0 10px 15px -3px rgba(19, 128, 236, 0.3), 0 4px 6px -2px rgba(19, 128, 236, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (totalItems > 0) {
              e.currentTarget.style.backgroundColor = '#0d6acb';
            }
          }}
          onMouseLeave={(e) => {
            if (totalItems > 0) {
              e.currentTarget.style.backgroundColor = '#1380ec';
            }
          }}
        >
          <span>결제하기</span>
          {totalItems === 0 ? null : <span>→</span>}
        </button>
      </footer>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalAmount}
        itemCount={totalItems}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default App;