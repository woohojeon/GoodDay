import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(join(__dirname, 'fleamarket.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  )`);
});

const BUSINESS_NUMBER = '123-45-67890';

const KAKAOPAY_CONFIG = {
  cid: 'TC0ONETIME',
  partner_order_id: '',
  partner_user_id: 'fleamarket_user',
  item_name: '',
  quantity: 1,
  total_amount: 0,
  tax_free_amount: 0,
  approval_url: 'http://localhost:3001/payment/kakao/success',
  cancel_url: 'http://localhost:3001/payment/kakao/cancel',
  fail_url: 'http://localhost:3001/payment/kakao/fail'
};

const TOSS_CONFIG = {
  clientKey: 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  secretKey: 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R',
  successUrl: 'http://localhost:3001/payment/toss/success',
  failUrl: 'http://localhost:3001/payment/toss/fail'
};

app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, items, totalAmount, notes } = req.body;
  const orderId = `FM${Date.now().toString().slice(-8)}`;
  
  const itemsJson = JSON.stringify(items);
  
  db.run(
    `INSERT INTO orders (id, customer_name, customer_phone, items, total_amount, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [orderId, customerName, customerPhone, itemsJson, totalAmount, notes],
    function(err) {
      if (err) {
        console.error('Order creation error:', err);
        return res.status(500).json({ error: 'Failed to create order' });
      }
      
      res.json({
        orderId,
        message: 'Order created successfully',
        businessNumber: BUSINESS_NUMBER
      });
    }
  );
});

app.post('/api/payments/kakao/ready', async (req, res) => {
  const { orderId, amount, itemName } = req.body;
  
  try {
    const response = await axios.post('https://kapi.kakao.com/v1/payment/ready', {
      ...KAKAOPAY_CONFIG,
      partner_order_id: orderId,
      item_name: itemName,
      total_amount: amount
    }, {
      headers: {
        'Authorization': 'KakaoAK YOUR_ADMIN_KEY_HERE',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    db.run(
      `INSERT INTO payments (id, order_id, payment_method, amount)
       VALUES (?, ?, ?, ?)`,
      [response.data.tid, orderId, 'kakao', amount]
    );
    
    res.json({
      tid: response.data.tid,
      next_redirect_pc_url: response.data.next_redirect_pc_url,
      next_redirect_mobile_url: response.data.next_redirect_mobile_url
    });
    
  } catch (error) {
    console.error('KakaoPay ready error:', error);
    res.status(500).json({ 
      error: 'Payment preparation failed',
      message: 'KakaoPay 연동을 위한 실제 키가 필요합니다.'
    });
  }
});

app.post('/api/payments/toss/ready', (req, res) => {
  const { orderId, amount, orderName } = req.body;
  
  db.run(
    `INSERT INTO payments (id, order_id, payment_method, amount)
     VALUES (?, ?, ?, ?)`,
    [`toss_${Date.now()}`, orderId, 'toss', amount]
  );
  
  res.json({
    clientKey: TOSS_CONFIG.clientKey,
    orderId,
    amount,
    orderName,
    successUrl: TOSS_CONFIG.successUrl,
    failUrl: TOSS_CONFIG.failUrl
  });
});

app.post('/api/payments/demo', (req, res) => {
  const { orderId, amount, method } = req.body;
  
  const paymentId = `${method}_${Date.now()}`;
  
  db.run(
    `INSERT INTO payments (id, order_id, payment_method, amount, status, transaction_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [paymentId, orderId, method, amount, 'completed', paymentId],
    function(err) {
      if (err) {
        console.error('Payment recording error:', err);
        return res.status(500).json({ error: 'Payment recording failed' });
      }
      
      db.run(
        `UPDATE orders SET payment_status = 'completed', payment_method = ? WHERE id = ?`,
        [method, orderId],
        (updateErr) => {
          if (updateErr) {
            console.error('Order update error:', updateErr);
          }
        }
      );
      
      res.json({
        paymentId,
        orderId,
        status: 'completed',
        message: 'Demo payment completed successfully'
      });
    }
  );
});

app.get('/api/orders', (req, res) => {
  db.all(
    `SELECT o.*, p.status as payment_status, p.transaction_id 
     FROM orders o 
     LEFT JOIN payments p ON o.id = p.order_id 
     ORDER BY o.created_at DESC`,
    (err, rows) => {
      if (err) {
        console.error('Orders retrieval error:', err);
        return res.status(500).json({ error: 'Failed to retrieve orders' });
      }
      
      const orders = rows.map(row => ({
        ...row,
        items: JSON.parse(row.items)
      }));
      
      res.json(orders);
    }
  );
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  db.get(
    `SELECT o.*, p.status as payment_status, p.transaction_id 
     FROM orders o 
     LEFT JOIN payments p ON o.id = p.order_id 
     WHERE o.id = ?`,
    [orderId],
    (err, row) => {
      if (err) {
        console.error('Order retrieval error:', err);
        return res.status(500).json({ error: 'Failed to retrieve order' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = {
        ...row,
        items: JSON.parse(row.items)
      };
      
      res.json(order);
    }
  );
});

app.get('/payment/kakao/success', (req, res) => {
  const { pg_token, orderId } = req.query;
  res.redirect(`http://localhost:5173?payment=success&orderId=${orderId}`);
});

app.get('/payment/kakao/cancel', (req, res) => {
  res.redirect('http://localhost:5173?payment=cancel');
});

app.get('/payment/kakao/fail', (req, res) => {
  res.redirect('http://localhost:5173?payment=fail');
});

app.get('/payment/toss/success', (req, res) => {
  const { orderId } = req.query;
  res.redirect(`http://localhost:5173?payment=success&orderId=${orderId}`);
});

app.get('/payment/toss/fail', (req, res) => {
  res.redirect('http://localhost:5173?payment=fail');
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Fleamarket API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: fleamarket.db`);
  console.log(`🏢 Business Number: ${BUSINESS_NUMBER}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});