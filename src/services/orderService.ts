// src/services/orderService.ts
import { supabase } from '../lib/supabaseClient';
import type { CartItem } from '../types';

export async function createOrder(items: CartItem[], method: 'kakao' | 'toss') {
  console.log("=== orderService.createOrder 시작 ===");
  console.log("입력된 items:", items);
  console.log("결제 방법:", method);
  
  // 먼저 연결 테스트
  try {
    const { data: testData, error: testError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1);
    
    console.log("테이블 연결 테스트 - data:", testData);
    console.log("테이블 연결 테스트 - error:", testError);
  } catch (e) {
    console.error("연결 테스트 실패:", e);
  }
  
  // 장바구니 상품들을 order_items에 바로 저장
  const orderItems = items.map((item) => ({
    order_id: null, // orders 안 쓰면 null 처리
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price
  }));

  console.log("생성된 orderItems:", orderItems);

  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  console.log("Supabase 응답 - data:", data);
  console.log("Supabase 응답 - error:", error);

  if (error) {
    console.error("Supabase 에러 발생:", error);
    console.error("에러 상세:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }

  return data;
}
