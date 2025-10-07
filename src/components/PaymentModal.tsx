import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleKakaoPayClick = () => {
    window.open('https://qr.kakaopay.com/Ej9QKajiY', '_blank');
    onSuccess();
  };

  const handleCopyAccount = () => {
    const accountNumber = '1002156708760';

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accountNumber)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback to textarea method
          fallbackCopy(accountNumber);
        });
    } else {
      // Fallback for older browsers
      fallbackCopy(accountNumber);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }

    document.body.removeChild(textarea);
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
            transition: 'all 0.2s ease',
            marginBottom: '16px'
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

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '14px', color: '#999' }}>또는</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Bank Account Information */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#666',
            margin: '0 0 12px 0'
          }}>계좌이체</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                color: '#999',
                margin: '0 0 4px 0'
              }}>우리은행 전우호</p>
              <p style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#000',
                margin: 0,
                letterSpacing: '0.5px'
              }}>1002-156-708760</p>
            </div>
            <button
              onClick={handleCopyAccount}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                backgroundColor: copied ? '#10b981' : '#fff',
                color: copied ? '#fff' : '#666',
                border: copied ? 'none' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 1
              }}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.backgroundColor = '#fff';
                }
              }}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  복사됨
                </>
              ) : (
                <>
                  <Copy size={16} />
                  복사
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};