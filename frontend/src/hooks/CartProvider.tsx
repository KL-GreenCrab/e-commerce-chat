import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartHook } from './useCart';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  add: (item: CartItem) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  getTotal: () => number;
  isEmpty: () => boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    cartItems, 
    loading, 
    add, 
    remove, 
    updateQuantity, 
    clear, 
    getTotal, 
    isEmpty, 
    fetchCart 
  } = useCartHook();

  const value = {
    cartItems,
    loading,
    add,
    remove,
    updateQuantity,
    clear,
    getTotal,
    isEmpty,
    fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
