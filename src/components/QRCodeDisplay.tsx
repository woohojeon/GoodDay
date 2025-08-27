import React, { useState, useEffect } from 'react';
import { QrCode, X, Wifi } from 'lucide-react';
import QRCodeReact from 'react-qr-code';

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [qrSize, setQrSize] = useState(240);

  // QR 크기: 화면 너비에 맞춰 자동
  useEffect(() => {
    const calc = () => {
      const w = Math.min(window.innerWidth, 480);
      const s = Math.max(180, Math.min(320, Math.floor(w * 0.75)));
      setQrSize(s);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // URL 결정 (localhost 회피는 .env로 관리 권장)
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingUrl(true);

    const envUrl = (import.meta as any).env?.VITE_PUBLIC_BASE_URL?.trim();
    let url = envUrl || window.location.origin;

    if (!envUrl && (location.hostname === 'localhost' || location.hostname.startsWith('127.'))) {
      console.warn('QR에 localhost가 들어가면 폰에서 안 열립니다. VITE_PUBLIC_BASE_URL을 설정하세요.');
    }

    setCurrentUrl(url);
    setIsLoadingUrl(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="qr-modal" role="dialog" aria-modal="true">
      <div className="qr-panel">
        <div className="qr-header">
          <div className="qr-header__title">
            <QrCode size={18} />
            <span>QR 코드</span>
          </div>
          <button className="qr-iconbtn" onClick={onClose} aria-label="QR 창 닫기">
            <X size={20} />
          </button>
        </div>

        <div className="qr-body">
          {isLoadingUrl ? (
            <div className="qr-box qr-box--loading">
              <Wifi size={28} />
              <p>네트워크 IP 확인 중...</p>
            </div>
          ) : currentUrl ? (
            <div className="qr-box">
              <QRCodeReact
                id="qr-code-svg"
                value={currentUrl}
                size={qrSize}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
              <div className="qr-url">{currentUrl}</div>
            </div>
          ) : (
            <div className="qr-box qr-box--error">
              URL을 가져올 수 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
