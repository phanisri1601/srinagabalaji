'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Check, AlertCircle, Copy, QrCode, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';
import { orderService, paymentService } from '@/services/firebaseService';

interface FirebasePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; phone: string; uid: string };
  onPaymentComplete: (order: any) => void;
}

export const FirebasePaymentModal: React.FC<FirebasePaymentModalProps> = ({
  isOpen,
  onClose,
  user,
  onPaymentComplete
}) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [paymentStep, setPaymentStep] = useState<'summary' | 'confirm' | 'payment' | 'success'>('summary');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const totalAmount = getTotalPrice();

  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    try {
      // Create order in Firebase (FREE - no payment required)
      const newOrderId = generateOrderId();
      const orderData = {
        userId: user.uid,
        user: {
          name: user.name,
          phone: user.phone,
          id: user.uid
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        totalAmount: totalAmount,
        total: totalAmount,
        status: 'pending' as const, // Auto-confirm for free orders
        paymentMethod: 'upi' as const,
        paymentStatus: 'completed' as const, // Auto-complete for free orders
        createdAt: new Date().toISOString(),
        orderId: newOrderId
      };

      const createdOrder = await orderService.createOrder(orderData);
      setOrderId(newOrderId);
      setPaymentStep('success');
      clearCart();
      onPaymentComplete(createdOrder);

    } catch (error) {
      console.error('Error creating order:', error);
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Create payment record
      const paymentData = {
        orderId,
        userId: user.uid,
        amount: totalAmount,
        method: 'upi' as const,
        upiId: 'nagabalaji@upi',
        status: 'completed' as const
      };

      await paymentService.createPayment(paymentData);

      // Update order status
      await orderService.updateOrderStatus(orderId, 'preparing');

      setPaymentStep('success');

      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        onPaymentComplete({ id: orderId });
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error confirming payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyUpiId = () => {
    setCopied(true);
    navigator.clipboard.writeText('nagabalaji@upi');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setPaymentStep('summary');
    setOrderId('');
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-rose-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {paymentStep === 'summary' && 'Order Summary'}
                      {paymentStep === 'payment' && 'Complete Payment'}
                      {paymentStep === 'success' && 'Payment Successful!'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {paymentStep === 'summary' && 'Review your order details'}
                      {paymentStep === 'payment' && 'Pay via UPI to confirm'}
                      {paymentStep === 'success' && 'Your order has been placed'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="sm"
                  className="p-2 border-emerald-200 text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                {paymentStep === 'summary' && (
                  <motion.div
                    key="summary-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* User Info */}
                    <Card className="bg-emerald-50 border-emerald-100">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">+91 {user.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Order Items</h3>
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-emerald-100 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {item.name.includes('Punugulu') ? '🍘' :
                                item.name.includes('Dosa') ? '🥞' :
                                  item.name.includes('Idly') ? '🍙' :
                                    item.name.includes('Vada') ? '🧇' :
                                      item.name.includes('Garelu') ? '🥮' : '🍽️'}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-emerald-600">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-emerald-100 pt-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-800">Total Amount</span>
                        <div className="flex items-center text-emerald-600">
                          <IndianRupee className="w-5 h-5 mr-1" />
                          {totalAmount}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateOrder}
                      loading={isProcessing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Order...
                        </>
                      ) : (
                        <>
                          Proceed to Payment
                          <IndianRupee className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {paymentStep === 'payment' && (
                  <motion.div
                    key="payment-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Scan to Pay</h3>
                      <p className="text-gray-600 mb-4">
                        Order ID: <span className="font-mono font-semibold">{orderId}</span>
                      </p>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="bg-gradient-to-br from-emerald-50 to-rose-50 p-8 rounded-lg text-center">
                      <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-emerald-200">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 text-emerald-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">QR Code</p>
                          <p className="text-xs text-gray-500">Demo Payment</p>
                        </div>
                      </div>
                    </div>

                    {/* UPI Details */}
                    <Card className="bg-white border-emerald-100">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">UPI ID</p>
                            <p className="font-mono font-semibold text-gray-800">nagabalaji@upi</p>
                          </div>
                          <Button
                            onClick={handleCopyUpiId}
                            variant="outline"
                            size="sm"
                            className="border-emerald-200 text-emerald-600"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                        <span className="text-sm text-gray-700">Amount to pay</span>
                      </div>
                      <div className="flex items-center text-rose-600 font-bold text-lg">
                        <IndianRupee className="w-5 h-5 mr-1" />
                        {totalAmount}
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmPayment}
                      loading={isProcessing}
                      className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-4"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Payment
                          <Check className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {paymentStep === 'success' && (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-white" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                      <p className="text-gray-600 mb-4">
                        Your order has been placed successfully
                      </p>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-mono font-semibold text-emerald-600">{orderId}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-medium text-gray-800">Estimated Time</p>
                          <p className="text-sm text-gray-600">20-30 minutes</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="font-medium text-gray-800">Customer</p>
                          <p className="text-sm text-gray-600">{user.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      <p>Redirecting to order tracking...</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
