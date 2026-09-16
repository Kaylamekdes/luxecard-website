import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CartContext, type CartItem, type CustomerInfo, type NewCartItem } from '../context/cartContext';
import { CartDrawer } from './CartDrawer';
import { Toast } from './Toast';

const STORAGE_KEY = 'luxecard_cart';

const SAMPLE_ITEMS: CartItem[] = [
  { id: 'sample-metallic-gold', name: 'Metallic', subOption: 'Gold', price: 10000, quantity: 1 },
  { id: 'sample-wood-natural', name: 'Wood', subOption: 'Natural', price: 7000, quantity: 2 },
];

type PersistedState = { items: CartItem[]; customerInfo: CustomerInfo | null };

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { items: parsed, customerInfo: null };
      if (parsed && Array.isArray(parsed.items)) {
        return { items: parsed.items, customerInfo: parsed.customerInfo ?? null };
      }
    }
  } catch {
    // ignore malformed/unavailable storage
  }
  return { items: SAMPLE_ITEMS, customerInfo: null };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = useRef<PersistedState | null>(null);
  if (!initial.current) initial.current = loadInitialState();

  const [items, setItems] = useState<CartItem[]>(initial.current.items);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(initial.current.customerInfo);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, customerInfo }));
    } catch {
      // ignore unavailable storage
    }
  }, [items, customerInfo]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

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

  const saveCustomerInfo = useCallback((info: CustomerInfo) => setCustomerInfo(info), []);

  const notify = useCallback((message: string) => setToastMessage(message), []);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      open,
      close,
      addItem,
      removeItem,
      updateQuantity,
      totalCount,
      totalPrice,
      customerInfo,
      saveCustomerInfo,
      notify,
    }),
    [
      items,
      isOpen,
      open,
      close,
      addItem,
      removeItem,
      updateQuantity,
      totalCount,
      totalPrice,
      customerInfo,
      saveCustomerInfo,
      notify,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <Toast message={toastMessage} />
    </CartContext.Provider>
  );
}
