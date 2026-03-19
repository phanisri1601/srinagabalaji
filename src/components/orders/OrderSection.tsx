'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, ChefHat, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types';

interface OrderSectionProps {
  user: {
    id: string;
    name: string;
    phone: string;
  };
}

export const OrderSection: React.FC<OrderSectionProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockOrders: Order[] = [
          {
            id: 'ORD123456',
            user,
            items: [
              {
                id: 'morning-5',
                name: 'Punugulu',
                price: 30,
                category: 'morning',
                isSpecial: true,
                quantity: 2
              }
            ],
            total: 100,
            status: 'ready',
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            paymentMethod: 'upi'
          },
          {
            id: 'ORD123455',
            user,
            items: [
              {
                id: 'morning-1',
                name: 'Idly',
                price: 30,
                category: 'morning',
                isSpecial: false,
                quantity: 4
              },
              {
                id: 'morning-2',
                name: 'Dosa',
                price: 30,
                category: 'morning',
                isSpecial: false,
                quantity: 2
              }
            ],
            total: 200,
            status: 'preparing',
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            paymentMethod: 'upi'
          }
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'preparing':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'ready':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Your Orders
          </h2>
          <p className="text-gray-400">
            Track your order status and history
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet. Start ordering from our menu!
            </p>
            <Button variant="outline">
              Browse Menu
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            Order #{order.id}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>{getStatusText(order.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
                          <p>Payment via UPI</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">₹{order.total}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-white mb-2">Order Items</h4>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400 w-8">{item.quantity}x</span>
                            <div>
                              <p className="text-white">{item.name}</p>
                              {item.isSpecial && (
                                <p className="text-xs text-yellow-500">⭐ Special</p>
                              )}
                            </div>
                          </div>
                          <span className="text-gray-300">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.status === 'ready' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="text-green-500 font-medium">
                            Your order is ready for pickup!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {order.status === 'preparing' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <ChefHat className="w-5 h-5 text-blue-500" />
                          <p className="text-blue-500">
                            Your order is being prepared...
                          </p>
                        </div>
                      </motion.div>
                    )}
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
