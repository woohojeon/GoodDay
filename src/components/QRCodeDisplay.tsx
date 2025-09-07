// src/components/QRCodeDisplay.tsx
import React, { useState, useEffect } from "react";
import { QrCode, X, Wifi } from "lucide-react";
import QRCodeReact from "react-qr-code";

interface QRCodeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);
  const [qrSize, setQrSize] = useState(240);

  useEffect(() => {
    const calc = () => {
      const w = Math.min(window.innerWidth, 480);
      const s = Math.max(180, Math.min(280, Math.floor(w * 0.6)));
      setQrSize(s);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingUrl(true);

    const envUrl = (import.meta as { env?: { VITE_PUBLIC_BASE_URL?: string } })
      .env?.VITE_PUBLIC_BASE_URL?.trim();
    const url = envUrl || window.location.origin;

    if (!envUrl && (location.hostname === "localhost" || location.hostname.startsWith("127."))) {
      console.warn("⚠️ QR에 localhost가 들어가면 휴대폰에서 접속 안 됩니다. VITE_PUBLIC_BASE_URL 설정하세요.");
    }

    setCurrentUrl(url);
    setIsLoadingUrl(false);
  }, [isOpen]);

  if (!isOpen) return null;

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
            <QrCode size={20} />
            QR 코드
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

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {isLoadingUrl ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '40px 20px',
              color: '#666'
            }}>
              <Wifi size={28} />
              <p style={{ margin: 0, fontSize: '14px' }}>네트워크 IP 확인 중...</p>
            </div>
          ) : currentUrl ? (
            <>
              <div style={{
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <QRCodeReact
                  id="qr-code-svg"
                  value={currentUrl}
                  size={qrSize}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                wordBreak: 'break-all',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                maxWidth: '100%'
              }}>
                {currentUrl}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '40px 20px',
              color: '#dc2626'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>URL을 가져올 수 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};