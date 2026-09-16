import { createContext, useContext } from 'react';

export type CartItem = {
  id: string;
  name: string;
  subOption?: string;
  price: number;
  quantity: number;
};

export type NewCartItem = Omit<CartItem, 'id' | 'quantity'> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalCount: number;
  totalPrice: number;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
