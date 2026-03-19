'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, X, Star, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'morning' | 'evening';
  description?: string;
  isSpecial?: boolean;
  prepTime?: string;
  image?: string;
}

interface ProfessionalMenuCardProps {
  item: MenuItem;
  delay?: number;
}

export const ProfessionalMenuCard: React.FC<ProfessionalMenuCardProps> = ({ item, delay = 0 }) => {
  const { getQuantityInCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const quantity = getQuantityInCart(item.id);

  const handleAddToCart = () => {
    addToCart(item);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Food Image Section */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-50 to-rose-50">
          {/* Real Food Image */}
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            /* Fallback Emoji */
            <div className="absolute inset-0 flex items-center justify-center text-7xl filter drop-shadow-lg">
              {item.name.includes('Punugulu') ? '🍘' :
               item.name.includes('Dosa') ? '🥞' :
               item.name.includes('Idly') ? '🍙' :
               item.name.includes('Vada') ? '🧇' :
               item.name.includes('Garelu') ? '🥮' :
               item.name.includes('Chitti') ? '🍘' : '🍽️'}
            </div>
          )}

          {/* Special Badge */}
          {item.isSpecial && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 15 }}
              className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg"
            >
              <Star className="w-3 h-3" />
              <span>Special</span>
            </motion.div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {item.category === 'morning' ? '☀️ Morning' : '🌙 Evening'}
          </div>

          {/* Price Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-lg"
          >
            <span className="font-bold">₹{item.price}</span>
          </motion.div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6">
          {/* Item Name */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300"
          >
            {item.name}
          </motion.h3>

          {/* Description */}
          {item.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-600 mb-3 line-clamp-2"
            >
              {item.description}
            </motion.p>
          )}

          {/* Special Item Note */}
          {item.isSpecial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-1 text-sm text-emerald-600 font-medium mb-3"
            >
              <Star className="w-4 h-4" />
              <span>⭐ Famous Item</span>
            </motion.div>
          )}

          {/* Prep Time */}
          {item.prepTime && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-1 text-xs text-gray-500 mb-4"
            >
              <Clock className="w-3 h-3" />
              <span>{item.prepTime}</span>
            </motion.div>
          )}

          {/* Action Section */}
          <div className="mt-4">
            {quantity === 0 ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                  size="md"
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
                <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Minus className="w-4 h-4 text-emerald-600" />
                    </motion.button>
                    <span className="font-bold text-lg text-gray-800 min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </motion.button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-emerald-600">₹{item.price * quantity}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
