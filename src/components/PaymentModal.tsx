import React, { useState } from 'react';
import { X, Smartphone, Wallet } from 'lucide-react';

type MethodKey = 'kakao' | 'toss';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  onSuccess: (method: MethodKey) => void; // ✅ 콜백
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
    onSuccess(selected); // ✅ App.tsx 로 콜백
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__panel">
        <div className="panel__header">
          <h2 className="panel__title">결제 방법 선택</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="결제창 닫기">
            <X size={20} />
          </button>
        </div>

        <div className="panel__body panel__body--gap">
          <div className="summary-box">
            <p className="summary-box__label">주문 요약</p>
            <p className="summary-box__items">{itemCount}개 상품</p>
            <p className="summary-box__total">
              {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(total)}
            </p>
          </div>

          <div className="pay-grid" style={{ gap: '16px', marginTop: '12px' }}>
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelected(m.key)}
                className={`pay-card ${selected === m.key ? 'is-selected' : ''}`}
              >
                <div className="pay-card__icon">{m.icon}</div>
                <div className="pay-card__texts">
                  <span className="pay-card__label">{m.label}</span>
                  <span className="pay-card__desc">{m.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="panel__footer">
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn--block btn--primary btn--lg"
            disabled={!selected}
          >
            {selected
              ? `${METHODS.find((m) => m.key === selected)?.label} 접수하기`
              : '결제수단을 선택하세요'}
          </button>
        </div>
      </div>
    </div>
  );
};
