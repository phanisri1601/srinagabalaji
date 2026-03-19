'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getQuantityInCart: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('nagabalaji-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('nagabalaji-cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nagabalaji-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    console.log('Adding to cart:', item);
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log('Updated cart (existing item):', updatedCart);
        return updatedCart;
      }
      const newCart = [...prevCart, { ...item, quantity: 1 }];
      console.log('Updated cart (new item):', newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    console.log('Removing from cart:', itemId);
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    console.log('Updating quantity:', itemId, quantity);
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCart([]);
  };

  const getTotalItems = () => {
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('Getting total items:', total, 'from cart:', cart);
    return total;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getQuantityInCart = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getQuantityInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
