import React from 'react';
import { X } from 'lucide-react';
import type { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '85vh',
          borderRadius: '12px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          animation: 'popup-bounce 0.3s ease-out',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
            }}
          >
            {product.name}
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
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Images */}
          {product.detailImages && product.detailImages.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: product.detailImages.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {product.detailImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: product.detailImages!.length === 1 ? '300px' : '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}

          {/* Price */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 4px 0',
              }}
            >
              가격
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
              }}
            >
              {product.price.toLocaleString()}원
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 8px 0',
                }}
              >
                상세 설명
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
