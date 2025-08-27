import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'fleamarket.db'));

console.log('🗃️  플리마켓 DB 내용 확인\n');

// 테이블 목록 확인
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    return;
  }
  
  console.log('📋 테이블 목록:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
  console.log('');
  
  // 주문 데이터 확인
  db.all("SELECT * FROM orders ORDER BY created_at DESC", (err, orders) => {
    if (err) {
      console.error('Error getting orders:', err);
      return;
    }
    
    console.log(`📦 주문 데이터 (${orders.length}개):`);
    if (orders.length === 0) {
      console.log('  주문이 없습니다.');
    } else {
      orders.forEach((order, index) => {
        console.log(`\n  [${index + 1}] 주문번호: ${order.id}`);
        console.log(`      고객명: ${order.customer_name}`);
        console.log(`      전화번호: ${order.customer_phone}`);
        console.log(`      금액: ${order.total_amount.toLocaleString()}원`);
        console.log(`      결제상태: ${order.payment_status}`);
        console.log(`      주문시간: ${new Date(order.created_at).toLocaleString('ko-KR')}`);
        
        try {
          const items = JSON.parse(order.items);
          console.log(`      주문내역:`);
          items.forEach(item => {
            console.log(`        - ${item.name} x${item.quantity} (${item.price.toLocaleString()}원)`);
          });
        } catch (e) {
          console.log(`      주문내역: ${order.items}`);
        }
        
        if (order.notes) {
          console.log(`      메모: ${order.notes}`);
        }
      });
    }
    
    console.log('\n');
    
    // 결제 데이터 확인
    db.all("SELECT * FROM payments ORDER BY created_at DESC", (err, payments) => {
      if (err) {
        console.error('Error getting payments:', err);
        return;
      }
      
      console.log(`💳 결제 데이터 (${payments.length}개):`);
      if (payments.length === 0) {
        console.log('  결제 기록이 없습니다.');
      } else {
        payments.forEach((payment, index) => {
          console.log(`\n  [${index + 1}] 결제ID: ${payment.id}`);
          console.log(`      주문번호: ${payment.order_id}`);
          console.log(`      결제방법: ${payment.payment_method}`);
          console.log(`      금액: ${payment.amount.toLocaleString()}원`);
          console.log(`      상태: ${payment.status}`);
          if (payment.transaction_id) {
            console.log(`      거래ID: ${payment.transaction_id}`);
          }
          console.log(`      결제시간: ${new Date(payment.created_at).toLocaleString('ko-KR')}`);
        });
      }
      
      // 통계 정보
      const totalSales = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const completedOrders = orders.filter(o => o.payment_status === 'completed').length;
      
      console.log('\n📊 통계:');
      console.log(`  총 매출: ${totalSales.toLocaleString()}원`);
      console.log(`  완료된 주문: ${completedOrders}건`);
      console.log(`  전체 주문: ${orders.length}건`);
      
      db.close();
    });
  });
});