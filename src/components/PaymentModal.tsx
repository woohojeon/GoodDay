import React, { useState } from 'react';
import { X, Smartphone, Wallet, CreditCard, CheckCircle } from 'lucide-react';

type MethodKey = 'kakao' | 'toss';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  onSuccess: (method: MethodKey) => void;
}

const METHODS: { key: MethodKey; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'kakao', label: '카카오페이', desc: '간편결제', icon: <Smartphone size={20} /> },
  { key: 'toss', label: '토스페이', desc: '간편결제', icon: <Wallet size={20} /> },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  itemCount,
  onSuccess,
}) => {
  const [selected, setSelected] = useState<MethodKey | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onSuccess(selected);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: '16px'
    }}>
      <div style={{
        position: 'relative',
        width: '90%',
        maxWidth: '420px',
        borderRadius: '12px',
        backgroundColor: 'white',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        animation: 'popup-bounce 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#000',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CreditCard size={20} />
            결제 방법 선택
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              color: '#666',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            margin: '0 0 4px 0'
          }}>주문 요약</p>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 8px 0'
          }}>{itemCount}개 상품</p>
          <p style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#000',
            margin: 0
          }}>
            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(total)}
          </p>
        </div>

        {/* Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {METHODS.map((method) => (
            <button
              key={method.key}
              type="button"
              onClick={() => setSelected(method.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '8px',
                border: selected === method.key ? '2px solid #000' : '1px solid #d1d5db',
                backgroundColor: selected === method.key ? '#f8f9fa' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (selected !== method.key) {
                  e.currentTarget.style.borderColor = '#666';
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== method.key) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              <div style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ color: '#333' }}>
                  {method.icon}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#000',
                  marginBottom: '2px'
                }}>
                  {method.label}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {method.desc}
                </div>
              </div>
              {selected === method.key && (
                <CheckCircle size={20} style={{ color: '#000' }} />
              )}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selected}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: selected ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (selected) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseLeave={(e) => {
            if (selected) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          {selected
            ? `${METHODS.find((m) => m.key === selected)?.label}로 결제하기 →`
            : '결제수단을 선택해주세요'}
        </button>
      </div>
    </div>
  );
};