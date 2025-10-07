import type { ReactNode } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
  detailImages?: string[];
};
export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  notes: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: CartItem[];
  total_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  notes?: string;
  transaction_id?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: ReactNode; // ← string → ReactNode 로 변경
  type: 'kakao' | 'toss' | 'demo';
}

export interface PaymentResponse {
  orderId: string;
  paymentId?: string;
  status: string;
  message?: string;
  redirectUrl?: string;
}