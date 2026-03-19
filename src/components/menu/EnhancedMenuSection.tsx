'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Plus, Minus, ShoppingCart, Utensils, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MenuItem, CartItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { menuItems } from '@/data/menu';

export const EnhancedMenuSection: React.FC = () => {
  const { addToCart, cart, updateQuantity } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  const morningItems = menuItems.filter(item => item.category === 'morning');
  const eveningItems = menuItems.filter(item => item.category === 'evening');

  const getQuantityInCart = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    console.log('EnhancedMenuSection: handleAddToCart called with item:', item);
    addToCart(item);
    setShowCart(true);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <Utensils className="w-4 h-4" />
            <span className="text-sm font-medium">Our Menu</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Fresh & Delicious
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {" "}South Indian Food
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience authentic flavors with our time-based menu. 
            Each item is prepared fresh with love and tradition.
          </p>

          {/* Time Tabs */}
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1 mb-8">
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Morning Menu</span>
              <span className="text-xs opacity-75">(6AM - 11AM)</span>
            </button>
            <button
              onClick={() => setActiveTab('evening')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'evening'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Evening Menu</span>
              <span className="text-xs opacity-75">(4:30PM - 9:30PM)</span>
            </button>
          </div>
        </motion.div>

        {/* Current Menu Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Menu Description */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg"
            >
              {activeTab === 'morning' ? (
                <>
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <span className="text-gray-700 font-medium">Start your day with energy!</span>
                </>
              ) : (
                <>
                  <Moon className="w-6 h-6 text-indigo-500" />
                  <span className="text-gray-700 font-medium">Perfect evening snacks!</span>
                </>
              )}
            </motion.div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {(activeTab === 'morning' ? morningItems : eveningItems).map((item, index) => {
              const quantity = getQuantityInCart(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="transform transition-all duration-300"
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                      {/* Food Image */}
                      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="text-6xl"
                        >
                          {item.name.includes('Punugulu') ? '🍘' :
                           item.name.includes('Dosa') ? '🥞' :
                           item.name.includes('Idly') ? '🍙' :
                           item.name.includes('Vada') ? '🧇' :
                           item.name.includes('Garelu') ? '🥮' :
                           item.name.includes('Chitti') ? '🍘' : '🍽️'}
                        </motion.div>
                        
                        {item.isSpecial && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
                          >
                            <Star className="w-3 h-3" />
                            <span>Special</span>
                          </motion.div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                              {item.name}
                            </h3>
                            {item.isSpecial && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm text-yellow-600 font-medium"
                              >
                                ⭐ Famous Item
                              </motion.p>
                            )}
                            <p className="text-sm text-gray-500">
                              {item.category === 'morning' ? 'Morning Special' : 'Evening Delight'}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.p 
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                              className="text-2xl font-bold text-orange-500"
                            >
                              ₹{item.price}
                            </motion.p>
                          </div>
                        </div>

                        {/* Cart Controls */}
                        {quantity === 0 ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-3"
                          >
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <motion.div className="flex items-center space-x-2">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    onClick={() => handleUpdateQuantity(item.id, quantity - 1)}
                                    size="sm"
                                    variant="outline"
                                    className="p-2 h-8 w-8 border-gray-300 hover:bg-red-50 hover:border-red-300"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                </motion.div>
                                
                                <motion.span 
                                  key={quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  className="font-bold text-gray-900 min-w-[2rem] text-center text-lg"
                                >
                                  {quantity}
                                </motion.span>
                                
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    onClick={() => handleUpdateQuantity(item.id, quantity + 1)}
                                    size="sm"
                                    variant="outline"
                                    className="p-2 h-8 w-8 border-gray-300 hover:bg-green-50 hover:border-green-300"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </motion.div>
                              </motion.div>
                              
                              <motion.div 
                                key={item.price * quantity}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className="text-right"
                              >
                                <span className="font-bold text-orange-500 text-lg">
                                  ₹{item.price * quantity}
                                </span>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Floating Cart Preview */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setShowCart(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </Button>
          </motion.div>
        )}

        {/* Debug Test Button */}
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            onClick={() => {
              console.log('Test button clicked');
              const testItem = menuItems[0];
              console.log('Adding test item:', testItem);
              addToCart(testItem);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
          >
            Test Add Item
          </Button>
        </div>
      </div>
    </section>
  );
};
