'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, User, Phone, IndianRupee, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/services/firebaseService';
import { Order } from '@/types';

interface FirebaseOrderSectionProps {
  user: { id: string; name: string; phone: string };
}

export const FirebaseOrderSection: React.FC<FirebaseOrderSectionProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const userOrders = await orderService.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'preparing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Orders
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Track your order history and status
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-5 h-5" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>+91 {user.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleRefresh}
            loading={refreshing}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our menu and place your first order!
            </p>
            <Button
              onClick={() => window.location.href = '#menu'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Browse Menu
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span>{getStatusText(order.status)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-500">
                            ₹{order.total}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={`${item.id}-${itemIndex}`} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">
                                {item.name.includes('Punugulu') ? '🍘' :
                                 item.name.includes('Dosa') ? '🥞' :
                                 item.name.includes('Idly') ? '🍙' :
                                 item.name.includes('Vada') ? '🧇' :
                                 item.name.includes('Garelu') ? '🥮' : '🍽️'}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">Order Placed</p>
                              <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          
                          {order.status === 'preparing' || order.status === 'ready' ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Preparing</p>
                                <p className="text-sm text-gray-600">Your order is being prepared</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 opacity-50">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Preparing</p>
                                <p className="text-sm text-gray-600">Waiting to start</p>
                              </div>
                            </div>
                          )}
                          
                          {order.status === 'ready' ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Ready for Pickup</p>
                                <p className="text-sm text-gray-600">Your order is ready!</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 opacity-50">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Ready for Pickup</p>
                                <p className="text-sm text-gray-600">Estimated 20-30 mins</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
