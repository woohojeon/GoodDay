import React from 'react';
import { X, Smartphone, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  itemCount,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const handleKakaoPayClick = () => {
    window.open('https://qr.kakaopay.com/Ej9QKajiY', '_blank');
    onSuccess();
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
            결제하기
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
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            margin: '0 0 8px 0'
          }}>주문 요약</p>
          <p style={{
            fontSize: '14px',
            color: '#999',
            margin: '0 0 16px 0'
          }}>{itemCount}개 상품</p>
          <p style={{
            fontSize: '40px',
            fontWeight: '800',
            color: '#000',
            margin: 0,
            letterSpacing: '-1px'
          }}>
            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(total)}
          </p>
        </div>

        {/* Payment Information */}
        <div style={{
          backgroundColor: '#fff5e6',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #ffcc02'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#d4690a',
            margin: '0 0 8px 0'
          }}>결제 안내</p>
          <p style={{
            fontSize: '14px',
            color: '#8b3c00',
            margin: 0,
            lineHeight: '1.4'
          }}>
            아래 카카오페이 버튼을 클릭하면 새 창에서 결제 페이지가 열립니다.<br/>
            결제 페이지에서 위 총 금액을 입력하여 결제를 완료해주세요.
          </p>
        </div>

        {/* KakaoPay Button */}
        <button
          onClick={handleKakaoPayClick}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: '#ffcc02',
            color: '#3c1e1e',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e6b800';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffcc02';
          }}
        >
          <Smartphone size={20} />
          카카오페이로 결제하기 →
        </button>
      </div>
    </div>
  );
};