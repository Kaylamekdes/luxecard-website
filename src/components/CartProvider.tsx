import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CartContext, type CartItem, type CustomerInfo, type NewCartItem } from '../context/cartContext';
import { CART_STORAGE_KEY as STORAGE_KEY } from '../utils/cartStorage';
import { BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD } from '../../api/_lib/pricing';
import { trackMetaEvent } from '../utils/metaPixel';
import { Toast } from './Toast';

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
  return { items: [], customerInfo: null };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = useRef<PersistedState | null>(null);
  if (!initial.current) initial.current = loadInitialState();

  const [items, setItems] = useState<CartItem[]>(initial.current.items);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(initial.current.customerInfo);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; description?: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, customerInfo }));
    } catch {
      // ignore unavailable storage
    }
  }, [items, customerInfo]);

  useEffect(() => {
    // Paystack's cancel_action (set in api/checkout.ts) sends a cancelled
    // checkout back here with ?checkout=cancelled so the cart reopens
    // automatically instead of leaving the user stranded on the homepage.
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') !== 'cancelled') return;
      setIsOpen(true);
      params.delete('checkout');
      const query = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));
    } catch {
      // ignore unavailable history/location APIs
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(timeout);
  }, [toast]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((newItem: NewCartItem) => {
    // Outside the state updater so it fires once per add, even when React
    // (StrictMode) runs updaters twice. No-op without cookie consent.
    const quantity = newItem.quantity ?? 1;
    trackMetaEvent('AddToCart', {
      value: newItem.price * quantity,
      currency: 'KES',
      content_type: 'product',
      content_name: newItem.name,
      content_ids: [newItem.name],
      contents: [{ id: newItem.name, quantity, item_price: newItem.price }],
    });
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

  const notify = useCallback((message: string, description?: string) => setToast({ message, description }), []);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  // Applies across the whole cart, so it holds regardless of how many
  // different finishes/quantities make up that total.
  const discount = totalCount > BULK_DISCOUNT_THRESHOLD ? subtotal * BULK_DISCOUNT_RATE : 0;
  const totalPrice = subtotal - discount;

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
      subtotal,
      discount,
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
      subtotal,
      discount,
      totalPrice,
      customerInfo,
      saveCustomerInfo,
      notify,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast message={toast?.message ?? null} description={toast?.description} />
    </CartContext.Provider>
  );
}
