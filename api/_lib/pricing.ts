// Authoritative server-side price list — mirrors src/components/InquiryModal.tsx's
// FINISH_PRICES/FINISH_OPTIONS, keyed by the same label strings the cart stores
// on each CartItem.name. Never trust a client-submitted price/total directly:
// the amount actually charged is recomputed from this list, not from whatever
// the browser sent.
export const FINISH_PRICES_BY_LABEL: Record<string, number> = {
  Plastic: 7000,
  Wood: 9000,
  Metallic: 12000,
  "Chairman's Card": 19000,
};

const BULK_DISCOUNT_THRESHOLD = 3;
const BULK_DISCOUNT_RATE = 0.1;

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

// Throws if any item references an unknown finish or a non-positive quantity,
// so a tampered request fails loudly instead of silently charging KES 0.
export function computeAuthoritativeTotals(items: CheckoutItem[]): ValidatedTotals {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty.');
  }

  let subtotal = 0;
  let totalCount = 0;

  for (const item of items) {
    const price = FINISH_PRICES_BY_LABEL[item.name];
    if (price === undefined) {
      throw new Error(`Unknown finish: ${item.name}`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.name}`);
    }
    subtotal += price * item.quantity;
    totalCount += item.quantity;
  }

  const discount = totalCount > BULK_DISCOUNT_THRESHOLD ? subtotal * BULK_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return { subtotal, discount, total, totalCount };
}
