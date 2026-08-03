import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game } from '../types';

interface CartContextType {
  cartItems: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Game[]>(() => {
    const savedCart = localStorage.getItem('playgrid_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('playgrid_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (game: Game) => {
    setCartItems(prev => {
      // Check if already in cart
      if (prev.find(item => item.id === game.id)) {
        return prev;
      }
      return [...prev, game];
    });
  };

  const removeFromCart = (gameId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== gameId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
