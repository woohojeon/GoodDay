import React, { useState } from 'react';
import { Plus, Minus, Check, Coffee, Shirt, Gift, QrCode } from 'lucide-react';
import { PaymentModal } from './components/PaymentModal';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { UserInfoModal } from './components/UserInfoModal';

import { initiateTossPayment } from './services/tossPaymentService';

import type { Product, CartItem } from './types';

const PRODUCTS: Product[] = [
  { id: '1', name: '아이스티', price: 3000, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdZMVzCpMBNJujnAW8Y7dfLkXbgBU5Lbl3LYIIcGqPo2jw9imOQ5Quz9KohkMZ0thtq2_Tnfrc_hhC_LCN1BXQxEgnmnRcIog2ySpbrpQyYucyqmKtwrSfQrGkpkXvWlkHflYwmNcr6c0hFe4DNLfl5NhJhCpB3cGLDD93kHpwqzZzxWj4iUY8Sjk6FdcRcKPrUQmgW8-DvVgh1wx7g6m_5-bJK3OIq2pRBFzG36aKeq34ZgkAp1Lh_xsOZh-GFBHTVwWHwGMSiSU', icon: <Coffee size={24} />, category: 'Beverages' },
  { id: '2', name: '아메리카노', price: 2500, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo-2Wv4YPQfo73SIRRtKUx4gG7Hl5TfO6ahYJRYiuZ0ownL2v50BtmqDrUNB7NbD0ciI1-kwJm8JwVRhNCAqIIEonbMbrvcJCLoidvqLgX0IEKcOAKK8KXtUBStJTHaw2nPsHA0tiATa-rJppMqdOHypARnQSoF94HX6aXmJCjIqCRHGkXVJMomPRt4aY--FMr_k5aIIcoeCNapROuz-m-wovkCzhvKbja70grpxHIAwEDniiZhESMY3E7atU4_TCX8039RHv6PDY', icon: <Coffee size={24} />, category: 'Beverages' },
  { id: '3', name: '초코라떼', price: 2500, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop&fm=jpg&auto=format', icon: <Coffee size={24} />, category: 'Beverages' },
  { id: '4', name: '모루 인형', price: 5900, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuN1i994tFc83HRQeeqxgND_sKG34sBCIldTJ1PyztoplEDOz4v7kF4slXF0o3F1NjpD4pA8ve59th-69K0X22-vs6trRz7D7QPv6Xsdgl1Uf7-6NjmfVvFhxIZq2gRXjliJCXlRxbavc7GwGbGYGURSS4hf5Q213BOvaY5HZtawWzp1HI7pxCZRuDSzujDjlEz9eCTuGTsa3sPNKp1X5-fs3pbCstbEX4lGbbmwplsxWZTs722mfcFljFT3RAMz9gw-TI6sezWb8', icon: <Gift size={24} />, category: 'Goods' },
  { id: '5', name: '수제 팔찌', price: 5900, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuSuBJP1MfPF4lVfvH9cY09GYRVeJ8nKdBTVkVvfmyLJ3naDSp90_1mmxEGtpMNgTH8WFysB5HQwrw3v_S_0GcZLLzSFunzgeCTt2pCnfA7Ug9_hwnyCPZ32MHGHAwYLZQWeDlB4YskSg_0dSssCqX2J6scKcJAsvNLMJ8Odfdt_OHqxHzdSqT5Or0-nJZGR_2a1bRC4vwogMVyZvkuXwWtbkJBC56wosSv80vvp1E2-LnrBFaaolaWK0B3Q_QqY_PnU4SAR7Lb9A', icon: <Shirt size={24} />, category: 'Accessories' },
  { id: '6', name: '모루인형 + 수제팔찌 세트', price: 10000, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=200&fit=crop&fm=jpg&auto=format', icon: <Gift size={24} />, category: 'Set' },
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
    <img 
      src={product.image}
      alt={product.name}
      style={{
        height: '96px',
        width: '96px',
        flexShrink: 0,
        borderRadius: '6px',
        objectFit: 'cover',
        border: '1px solid #e5e7eb'
      }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNiAzNkg2MEw1NiA1Nkg0OEw0NCA0NEg1Mkw0NCAzNkg1Mkw0NCAyOEg1MloiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iNDQiIGN5PSIzNiIgcj0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=';
      }}
    />
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

const OrderCompletionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '20px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Check size={32} color="white" />
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          주문 완료!
        </h2>
        <div style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 32px 0'
        }}>
          주문이 성공적으로 접수되었습니다.
        </div>
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: '#1380ec',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0d6acb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1380ec';
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useLocalStorage<Record<string, number>>('fleamarket-cart', {});
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
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
    setIsUserInfoOpen(true);
  };

  const handleUserInfoSubmit = () => {
    setIsUserInfoOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (method: 'kakao' | 'toss') => {
    try {
      await initiateTossPayment(cartItems, method);
      setIsPaymentOpen(false);
      setIsSuccessOpen(true);
      setCart({});
      showToast('주문이 완료되었습니다!');
    } catch (err) {
      console.error("=== 결제 에러 ===", err);
      showToast('결제 요청 실패', 'error');
    }
  };

  const handleSuccess = () => {
    setIsSuccessOpen(false);
    setCart({});
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
        justifyContent: 'space-between',
        gap: '16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        padding: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            🍀 굿데이 일일찻집
          </h1>
        </div>
        <button 
          onClick={() => setIsQROpen(true)}
          style={{
            position: 'relative',
            borderRadius: '50%',
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <QrCode size={20} color="#4b5563" />
          {totalItems > 0 && (
            <div style={{
              position: 'absolute',
              right: '-4px',
              top: '-4px',
              display: 'flex',
              height: '20px',
              width: '20px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: '#1380ec',
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>
              {totalItems}
            </div>
          )}
        </button>
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

          {/* 굿즈 섹션 */}
          <div>
            <h2 style={{
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '700',
              color: '#000'
            }}>
              굿즈
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {PRODUCTS.filter(p => p.category === 'Goods' || p.category === 'Accessories').map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

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
      <UserInfoModal
        isOpen={isUserInfoOpen}
        onClose={() => setIsUserInfoOpen(false)}
        onSubmit={handleUserInfoSubmit}
      />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalAmount}
        itemCount={totalItems}
        onSuccess={handlePaymentSuccess}
      />
      <OrderCompletionModal isOpen={isSuccessOpen} onClose={handleSuccess} />
      <QRCodeDisplay isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
    </div>
  );
};

export default App;