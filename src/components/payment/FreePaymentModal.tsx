'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Check, Clock, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/firebaseService';

interface CashfreePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; phone: string; uid: string };
  onPaymentComplete: (order: any) => void;
}

export const CashfreePaymentModal: React.FC<CashfreePaymentModalProps> = ({
  isOpen,
  onClose,
  user,
  onPaymentComplete
}) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [paymentStep, setPaymentStep] = useState<'summary' | 'confirm' | 'success'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const totalAmount = getTotalPrice();

  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const handleCreateOrder = async () => {
    setIsProcessing(true);
    try {
      // Create order in Firebase with Cashfree payment
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
        total: totalAmount,
        totalAmount: totalAmount,
        status: 'pending' as const, // Pending payment confirmation
        paymentMethod: 'upi' as const, // Cashfree UPI payment
        paymentStatus: 'pending', // Pending payment
        createdAt: new Date(),
        orderId: newOrderId
      };

      const createdOrder = await orderService.createOrder(orderData);
      setOrderId(newOrderId);
      setPaymentStep('confirm'); // Show payment confirmation
      clearCart();
      onPaymentComplete(createdOrder);

    } catch (error) {
      console.error('Error creating order:', error);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentStep('summary');
    setOrderId('');
    setIsProcessing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto md:max-w-lg lg:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white border-0 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {paymentStep === 'success' ? 'Payment Successful!' : 'Secure Payment'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {paymentStep === 'success' 
                    ? 'Your order has been placed successfully' 
                    : 'Complete your order with Cashfree secure payment'}
                </p>
                </div>

                {/* Order Summary */}
                {paymentStep === 'summary' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* User Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">Customer Details</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Name:</span> {user.name}</p>
                        <p><span className="text-gray-600">Phone:</span> {user.phone}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {cart.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-emerald-600">₹{totalAmount}</span>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Secured by Cashfree
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={handleCreateOrder}
                      disabled={isProcessing || cart.length === 0}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Clock className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <IndianRupee className="w-5 h-5" />
                          <span>Pay with Cashfree</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Success */}
                {paymentStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Order #{orderId}</h3>
                      <p className="text-gray-600">Your free order has been confirmed!</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                      <p className="text-sm"><span className="font-medium">Items:</span> {cart.length}</p>
                      <p className="text-sm"><span className="font-medium">Total:</span> ₹{totalAmount}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> Confirmed</p>
                    </div>

                    <Button
                      onClick={handleClose}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
