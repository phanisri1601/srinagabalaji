'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, Trash2, Lock, User, IndianRupee, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';

interface SimpleCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  user?: { name: string; phone: string } | null;
}

export const SimpleCartSidebar: React.FC<SimpleCartSidebarProps> = ({
  isOpen,
  onClose,
  onCheckout,
  user
}) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, quantity);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-rose-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🛒</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                    <p className="text-sm text-gray-600">
                      {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {cart.length > 0 && (
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      size="sm"
                      className="p-2 border-gray-200 text-gray-600 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="p-2 border-gray-200 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white to-emerald-50">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🛒</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add some delicious items to get started!
                    </p>
                    <Button onClick={onClose} variant="outline" className="border-emerald-200 text-gray-700">
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white border-emerald-100 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              {/* Food Icon */}
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">
                                  {item.name.includes('Punugulu') ? '🍘' :
                                   item.name.includes('Dosa') ? '🥞' :
                                   item.name.includes('Idly') ? '🍙' :
                                   item.name.includes('Vada') ? '🧇' :
                                   item.name.includes('Garelu') ? '🥮' :
                                   item.name.includes('Chitti') ? '🍘' : '🍽️'}
                                </span>
                              </div>

                              {/* Item Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                                    {item.isSpecial && (
                                      <p className="text-xs text-emerald-600 mt-1">⭐ Special Item</p>
                                    )}
                                  </div>
                                  <Button
                                    onClick={() => removeFromCart(item.id)}
                                    variant="outline"
                                    size="sm"
                                    className="p-1 border-emerald-200 text-gray-400 hover:text-rose-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                      size="sm"
                                      variant="outline"
                                      className="p-1 h-8 w-8 border-emerald-200"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold text-gray-800">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                      size="sm"
                                      variant="outline"
                                      className="p-1 h-8 w-8 border-emerald-200"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="font-bold text-emerald-600">
                                      ₹{item.price * item.quantity}
                                    </p>
                                  </div>
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

              {/* Footer */}
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50 to-rose-50 p-6 space-y-4"
                >
                  {/* User Status */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                    <div className="flex items-center space-x-2">
                      {user ? (
                        <>
                          <User className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-gray-700">
                            Logged in as <span className="font-medium">{user.name}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-500" />
                          <span className="text-sm text-gray-700">Login required to checkout</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <div className="flex items-center text-emerald-600 font-bold text-xl">
                      <IndianRupee className="w-5 h-5" />
                      {getTotalPrice()}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={() => {
                      console.log('Checkout button clicked in cart');
                      onCheckout();
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl"
                    disabled={!user}
                  >
                    {user ? (
                      <>
                        Proceed to Payment
                        <IndianRupee className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Login to Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {!user && (
                    <p className="text-xs text-gray-500 text-center">
                      Please login to complete your order
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
