'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, QrCode, Smartphone, Check, ArrowRight } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';
import { CartItem, User, Order } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onPaymentComplete: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  user,
  onPaymentComplete
}) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const total = getTotalPrice();
  const upiId = 'nagabalaji@upi';
  const upiName = 'Sri Nagabalaji Tiffin Centre';

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen]);

  const generateQRCode = async () => {
    try {
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`;
      const qrDataUrl = await QRCode.toDataURL(upiString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#1f2937'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handlePaymentConfirmation = async () => {
    setProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order: Order = {
        id: `ORD${Date.now()}`,
        user,
        items: [...cart],
        total,
        status: 'pending',
        createdAt: new Date(),
        paymentMethod: 'upi'
      };

      setPaymentConfirmed(true);
      
      setTimeout(() => {
        onPaymentComplete(order);
        clearCart();
        onClose();
        setPaymentConfirmed(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
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
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Payment</h2>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-300">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Total</span>
                          <div className="flex items-center text-orange-500 font-bold text-lg">
                            <IndianRupee className="w-5 h-5" />
                            {total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {!paymentConfirmed ? (
                  <>
                    {/* UPI Payment Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Pay with UPI</h3>
                      
                      {/* QR Code */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-lg p-2">
                              {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <QrCode className="w-16 h-16 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              Scan QR code with any UPI app
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* UPI ID */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">UPI ID</p>
                              <p className="text-white font-mono font-semibold">{upiId}</p>
                            </div>
                            <Button
                              onClick={copyUpiId}
                              variant="outline"
                              size="sm"
                            >
                              Copy
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Apps */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { name: 'Google Pay', icon: '📱' },
                          { name: 'PhonePe', icon: '📱' },
                          { name: 'Paytm', icon: '📱' }
                        ].map((app) => (
                          <Card key={app.name} hover className="text-center p-3">
                            <CardContent className="p-0">
                              <div className="text-2xl mb-1">{app.icon}</div>
                              <p className="text-xs text-gray-300">{app.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Payment Confirmation */}
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Smartphone className="w-5 h-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-white font-medium mb-1">
                              After completing payment
                            </p>
                            <p className="text-sm text-gray-300">
                              Click "I have paid" below to confirm your order
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handlePaymentConfirmation}
                        loading={processing}
                        className="w-full"
                        size="lg"
                      >
                        <Check className="w-5 h-5" />
                        I have paid
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Your order has been placed successfully
                    </p>
                    <div className="animate-pulse">
                      <p className="text-sm text-orange-500">Processing your order...</p>
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
