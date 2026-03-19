'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Phone, MapPin, Clock, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
  onCartClick?: () => void;
  onLoginClick?: () => void;
  user?: { name: string; phone: string; uid: string } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick, onLoginClick, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100 transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <img 
                src="/logo.jpg" 
                alt="Sri Nagabalaji Tiffin Centre Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Sri Nagabalaji
                </h1>
                <p className="text-xs text-gray-600">Tiffin Centre</p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#menu" className="font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                Menu
              </a>
              <a href="#about" className="font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                About
              </a>
              <a href="#contact" className="font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                Contact
              </a>
              
              {/* Contact Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>+91 9293948339</span>
                </div>
              </div>

              {/* User Profile/Login Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white transition-colors"
              >
                {user ? (
                  <>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-rose-600" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">{user.name.split(' ')[0]}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:block">Login</span>
                  </>
                )}
              </motion.button>

              {/* Logout Button - Only show when user is logged in */}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">Logout</span>
                </motion.button>
              )}

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCartClick}
                className="relative p-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-emerald-100 md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="#menu" className="block font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                Menu
              </a>
              <a href="#about" className="block font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                About
              </a>
              <a href="#contact" className="block font-medium text-gray-700 hover:text-emerald-500 transition-colors">
                Contact
              </a>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 pt-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>6AM - 11AM, 4:30PM - 9:30PM</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* User Profile/Login Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onLoginClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 p-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
                  >
                    {user ? (
                      <>
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-medium">{user.name.split(' ')[0]}</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span className="text-xs font-medium">Login</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onCartClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative p-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {getTotalItems()}
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
