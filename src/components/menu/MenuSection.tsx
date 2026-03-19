'use client';

import { motion } from 'framer-motion';
import { Clock, Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MenuItem, CartItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { getCurrentMenu, isBusinessHours, getNextOpeningTime } from '@/data/menu';

export const MenuSection: React.FC = () => {
  const { addToCart, cart, updateQuantity } = useCart();
  const currentMenu = getCurrentMenu();
  const businessOpen = isBusinessHours();

  const getQuantityInCart = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Menu
          </h2>
          <div className="flex items-center justify-center space-x-4 text-gray-300">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>
              {businessOpen ? 'Open Now' : getNextOpeningTime()}
            </span>
          </div>
        </motion.div>

        {!businessOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700 p-8 max-w-md mx-auto">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                We're Closed Now
              </h3>
              <p className="text-gray-400 mb-4">
                {getNextOpeningTime()}
              </p>
              <div className="text-left bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-2">
                  <span className="font-semibold">Morning:</span> 6:00 AM – 11:00 AM
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Evening:</span> 4:30 PM – 9:30 PM
                </p>
              </div>
            </div>
          </motion.div>
        ) : currentMenu.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-400">No items available at this time</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMenu.map((item, index) => {
              const quantity = getQuantityInCart(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                          <span className="text-4xl">🍽️</span>
                        </div>
                        
                        {item.isSpecial && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                          >
                            <Star className="w-3 h-3" />
                            <span>Special</span>
                          </motion.div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {item.name}
                            </h3>
                            {item.isSpecial && (
                              <p className="text-xs text-yellow-500 font-medium">
                                Famous Item ⭐
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-500">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        {quantity === 0 ? (
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                              size="sm"
                              variant="outline"
                              className="p-2"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex-1 text-center">
                              <span className="text-lg font-semibold text-white">
                                {quantity}
                              </span>
                            </div>
                            
                            <Button
                              onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                              size="sm"
                              variant="outline"
                              className="p-2"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
