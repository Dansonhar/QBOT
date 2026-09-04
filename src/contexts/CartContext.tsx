import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { WaOrderItem, CartItem } from '../types/waorder';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: WaOrderItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: WaOrderItem) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter(ci => ci.item.id !== itemId);
      return prev.map(ci => ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
    } else {
      setCartItems(prev => prev.map(ci => ci.item.id === itemId ? { ...ci, quantity } : ci));
    }
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const getQuantity = useCallback((itemId: string) => {
    return cartItems.find(ci => ci.item.id === itemId)?.quantity || 0;
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, getQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
