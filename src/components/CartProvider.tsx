import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CartContext, type CartItem, type NewCartItem } from '../context/cartContext';
import { CartDrawer } from './CartDrawer';

const STORAGE_KEY = 'luxecard_cart';

const SAMPLE_ITEMS: CartItem[] = [
  { id: 'sample-metallic-gold', name: 'Metallic', subOption: 'Gold', price: 10000, quantity: 1 },
  { id: 'sample-wood-natural', name: 'Wood', subOption: 'Natural', price: 7000, quantity: 2 },
];

function loadInitialItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch {
    // ignore malformed/unavailable storage
  }
  return SAMPLE_ITEMS;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialItems);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore unavailable storage
    }
  }, [items]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((newItem: NewCartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === newItem.name && i.subOption === newItem.subOption);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) } : i,
        );
      }
      return [...prev, { ...newItem, id: crypto.randomUUID(), quantity: newItem.quantity ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, isOpen, open, close, addItem, removeItem, updateQuantity, totalCount, totalPrice }),
    [items, isOpen, open, close, addItem, removeItem, updateQuantity, totalCount, totalPrice],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
