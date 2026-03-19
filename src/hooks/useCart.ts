'use client';

import { useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('nagabalaji-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nagabalaji-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
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
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};
