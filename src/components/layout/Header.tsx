'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Phone, MapPin } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nagabalaji Tiffin</h1>
              <p className="text-xs text-gray-400">Authentic South Indian Food</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-6 text-gray-300"
            >
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>6AM-11AM, 4:30PM-9:30PM</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Vijayawada</span>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
