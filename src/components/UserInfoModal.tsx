import React, { useState } from 'react';
import { X, User, Phone } from 'lucide-react';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSubmit();
      setName('');
      setPhone('');
    }
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
        maxWidth: '400px',
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
            <User size={20} />
            주문자 정보
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'flex',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '6px',
              alignItems: 'center',
              gap: '4px'
            }}>
              <User size={14} />
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#000';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'flex',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '6px',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Phone size={14} />
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                let formatted = value;
                if (value.length >= 4) {
                  formatted = value.slice(0, 3) + '-' + value.slice(3);
                }
                if (value.length >= 8) {
                  formatted = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
                setPhone(formatted);
              }}
              placeholder="010-1234-5678"
              maxLength={13}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: 'white',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#000';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !phone.trim()}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: name.trim() && phone.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: name.trim() && phone.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (name.trim() && phone.trim()) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (name.trim() && phone.trim()) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            다음 단계 →
          </button>
        </form>
      </div>
    </div>
  );
};