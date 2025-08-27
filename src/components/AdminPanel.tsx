import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, DollarSign, Clock, User, Phone } from 'lucide-react';
import { orderApi } from '../services/api';
import type { Order } from '../types';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR');
};

export const AdminPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedOrders = await orderApi.getAllOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError('주문 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalSales = orders
    .filter(order => order.payment_status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0);
  
  const completedOrders = orders.filter(order => order.payment_status === 'completed').length;
  const pendingOrders = orders.filter(order => order.payment_status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">관리자 패널</h1>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">총 매출</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(totalSales)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">완료된 주문</p>
                  <p className="text-2xl font-bold text-blue-700">{completedOrders}건</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-600 font-medium">대기 중인 주문</p>
                  <p className="text-2xl font-bold text-yellow-700">{pendingOrders}건</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">주문번호</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">고객정보</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">주문내역</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">금액</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">결제상태</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">주문시간</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      주문 데이터를 불러오는 중...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{order.id}</span>
                        {order.transaction_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            거래ID: {order.transaction_id}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-start space-x-2">
                          <User className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name}</p>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{order.customer_phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            메모: {order.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                        {order.payment_method && (
                          <p className="text-xs text-gray-500 mt-1">
                            {order.payment_method}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.payment_status === 'completed' ? '완료' :
                           order.payment_status === 'pending' ? '대기중' : '실패'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};