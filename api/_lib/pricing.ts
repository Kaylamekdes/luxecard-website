// Authoritative price list, keyed by the same label strings the cart stores on
// each CartItem.name. Never trust a client-submitted price/total directly: the
// amount actually charged is recomputed from this list, not from whatever the
// browser sent.
//
// This file is also the single source for the frontend: the order form
// (InquiryModal), the cart (CartProvider) and the homepage FAQ import these
// values, so changing a price or the bulk discount here updates all of them.
// Keep it dependency-free so it stays safe to bundle into the browser.
export const FINISH_PRICES_BY_LABEL: Record<string, number> = {
  Plastic: 7000,
  Wood: 9000,
  Metallic: 12000,
  "Chairman's Card": 19000,
};

// 10% off once an order has more than 3 cards.
export const BULK_DISCOUNT_THRESHOLD = 3;
export const BULK_DISCOUNT_RATE = 0.1;

// Which sub-options exist for a finish (the label strings the cart actually
// stores, not the form's internal <select> values). Plastic and Chairman's
// Card have none. KEEP IN SYNC with the SUB_OPTIONS map in
// src/components/InquiryModal.tsx — the form itself only ever offers these,
// but this is what stops anything else (including a removed option, like
// Metallic's old Gold) from being submitted directly to the API.
export const SUB_OPTIONS_BY_LABEL: Record<string, string[]> = {
  Wood: ['Natural', 'Black'],
  Metallic: ['Silver', 'Black'],
};

export type CheckoutItem = {
  name: string;
  subOption?: string;
  quantity: number;
};

export type ValidatedTotals = {
  subtotal: number;
  discount: number;
  total: number;
  totalCount: number;
};

// Hard caps against an absurd cart (a huge item count or a huge quantity on
// one item) - shared by every caller of computeAuthoritativeTotals, so
// checkout.ts and the webhook are covered exactly the same as cart-leads.ts
// already was. The length check runs before the loop below, so an
// oversized array is rejected in O(1) rather than iterated first.
export const MAX_ITEMS = 20;
export const MAX_QUANTITY = 10000;

// Throws if any item references an unknown finish, a non-positive or
// excessive quantity, or the cart has too many line items - so a tampered
// or malicious request fails loudly instead of silently charging the
// wrong amount (or being processed at all).
export function computeAuthoritativeTotals(items: CheckoutItem[]): ValidatedTotals {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty.');
  }
  if (items.length > MAX_ITEMS) {
    throw new Error(`Too many items in the cart (max ${MAX_ITEMS}).`);
  }

  let subtotal = 0;
  let totalCount = 0;

  for (const item of items) {
    const price = FINISH_PRICES_BY_LABEL[item.name];
    if (price === undefined) {
      throw new Error(`Unknown finish: ${item.name}`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > MAX_QUANTITY) {
      throw new Error(`Invalid quantity for ${item.name}`);
    }
    const allowedSubOptions = SUB_OPTIONS_BY_LABEL[item.name];
    if (allowedSubOptions) {
      if (!item.subOption || !allowedSubOptions.includes(item.subOption)) {
        throw new Error(`Invalid sub-option for ${item.name}: ${item.subOption ?? '(none)'}`);
      }
    } else if (item.subOption) {
      throw new Error(`${item.name} does not take a sub-option.`);
    }
    subtotal += price * item.quantity;
    totalCount += item.quantity;
  }

  const discount = totalCount > BULK_DISCOUNT_THRESHOLD ? subtotal * BULK_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return { subtotal, discount, total, totalCount };
}
