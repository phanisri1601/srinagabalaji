'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, quantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-800 shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                <div className="flex items-center space-x-2">
                  {cart.length > 0 && (
                    <Button
                      onClick={handleClearCart}
                      variant="outline"
                      size="sm"
                      className="p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🛒</span>
                    </div>
                    <p className="text-gray-400 mb-4">Your cart is empty</p>
                    <Button onClick={onClose} variant="outline">
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-gray-400 text-sm">₹{item.price} each</p>
                            {item.isSpecial && (
                              <p className="text-xs text-yellow-500 mt-1">⭐ Special Item</p>
                            )}
                          </div>
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="outline"
                            size="sm"
                            className="p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              size="sm"
                              variant="outline"
                              className="p-1"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-white font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              size="sm"
                              variant="outline"
                              className="p-1"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-orange-500">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-gray-700 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-300">Total</span>
                    <div className="flex items-center text-orange-500 font-bold text-xl">
                      <IndianRupee className="w-5 h-5" />
                      {getTotalPrice()}
                    </div>
                  </div>

                  <Button
                    onClick={onCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Payment
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
