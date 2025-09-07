// src/services/tossPaymentService.ts
import type { CartItem } from '../types';

declare global {
  interface Window {
    TossPayments: any;
  }
}

export async function initiateTossPayment(cartItems: CartItem[], method: 'kakao' | 'toss') {
  const tossClientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
  
  if (!tossClientKey) {
    throw new Error('TossPayments 클라이언트 키가 설정되지 않았습니다.');
  }

  // TossPayments 인스턴스 생성
  const tossPayments = window.TossPayments(tossClientKey);

  // 주문 정보 생성
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderName = cartItems.length === 1 
    ? cartItems[0].name 
    : `${cartItems[0].name} 외 ${cartItems.length - 1}건`;

  // 결제 요청
  try {
    if (method === 'toss') {
      // 토스페이 결제
      await tossPayments.requestPayment('토스페이', {
        amount: total,
        orderId: orderId,
        orderName: orderName,
        customerName: '고객',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } else if (method === 'kakao') {
      // 카카오페이 결제  
      await tossPayments.requestPayment('카카오페이', {
        amount: total,
        orderId: orderId,
        orderName: orderName,
        customerName: '고객',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    }
  } catch (error) {
    console.error('TossPayments 결제 요청 실패:', error);
    throw error;
  }
}