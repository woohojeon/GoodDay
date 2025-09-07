import axios from 'axios';
import type { CheckoutForm, CartItem, Order, PaymentResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const orderApi = {
  async createOrder(customerData: CheckoutForm, items: CartItem[], totalAmount: number): Promise<{ orderId: string; businessNumber: string }> {
    const response = await api.post('/orders', {
      customerName: customerData.name,
      customerPhone: customerData.phone,
      items,
      totalAmount,
      notes: customerData.notes,
    });
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },
};

export const paymentApi = {
  async processKakaoPayment(orderId: string, amount: number, itemName: string): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payments/kakao/ready', {
        orderId,
        amount,
        itemName,
      });
      
      return {
        orderId,
        status: 'redirect_required',
        redirectUrl: response.data.next_redirect_pc_url,
        message: 'KakaoPay 결제 페이지로 이동합니다.',
      };
    } catch (error: unknown) {
      return {
        orderId,
        status: 'error',
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'KakaoPay 결제 준비 중 오류가 발생했습니다.',
      };
    }
  },

  async processTossPayment(orderId: string, amount: number, orderName: string): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payments/toss/ready', {
        orderId,
        amount,
        orderName,
      });
      
      const { clientKey, successUrl, failUrl } = response.data;
      
      if (typeof window !== 'undefined' && (window as { TossPayments?: (key: string) => unknown }).TossPayments) {
        const tossPayments = (window as { TossPayments: (key: string) => { requestPayment: (method: string, options: unknown) => Promise<void> } }).TossPayments(clientKey);
        
        await tossPayments.requestPayment('카드', {
          amount,
          orderId,
          orderName,
          successUrl,
          failUrl,
          customerName: '고객',
        });
        
        return {
          orderId,
          status: 'processing',
          message: 'Toss 결제가 진행중입니다.',
        };
      } else {
        return {
          orderId,
          status: 'error',
          message: 'Toss Payments SDK가 로드되지 않았습니다.',
        };
      }
    } catch (error: unknown) {
      return {
        orderId,
        status: 'error',
        message: (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Toss 결제 준비 중 오류가 발생했습니다.',
      };
    }
  },

  async processDemoPayment(orderId: string, amount: number, method: string): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payments/demo', {
        orderId,
        amount,
        method,
      });
      
      return {
        orderId,
        paymentId: response.data.paymentId,
        status: 'completed',
        message: '데모 결제가 완료되었습니다.',
      };
    } catch {
      return {
        orderId,
        status: 'error',
        message: '데모 결제 처리 중 오류가 발생했습니다.',
      };
    }
  },
};