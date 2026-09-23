// Shared with CartProvider so both stay in sync on the same localStorage
// key/shape. OrderConfirmation lives outside CartProvider's tree (App.tsx
// renders it standalone), so it clears the cart directly here rather than
// through cart context.
export const CART_STORAGE_KEY = 'luxecard_cart';

export function clearCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const customerInfo = Array.isArray(parsed) ? null : parsed?.customerInfo ?? null;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [], customerInfo }));
  } catch {
    // ignore malformed/unavailable storage
  }
}
