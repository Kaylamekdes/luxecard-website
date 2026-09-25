// KEEP IN SYNC with src/utils/kra.ts: that is the browser-side copy of this
// same rule (this folder can't import from src/, and src/ can't import from
// here). If the PIN format or the limits change, change both files.

export const KRA_PIN_PATTERN = /^[A-Z][0-9]{9}[A-Z]$/;
export const KRA_PIN_ERROR = 'Enter a valid KRA PIN, e.g. P051234567X.';
export const BUSINESS_NAME_ERROR = 'Enter the business name as registered with KRA.';
export const KRA_BUSINESS_NAME_MAX = 200;

// Uppercases and strips any whitespace, so " p051 234567x " becomes "P051234567X".
export function normalizeKraPin(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

export type Etims = { kraPin: string; businessName: string };

// The single gate for eTIMS details coming from the browser (or echoed back in
// Paystack metadata). Anything that isn't an explicit `needs === true` is
// discarded, so a PIN can never be stored for an order that didn't ask for
// an invoice.
export function readEtims(needs: unknown, pin: unknown, businessName: unknown): { etims: Etims | null } | { error: string } {
  if (needs !== true) return { etims: null };

  const kraPin = typeof pin === 'string' ? normalizeKraPin(pin) : '';
  if (!KRA_PIN_PATTERN.test(kraPin)) return { error: KRA_PIN_ERROR };

  const name = typeof businessName === 'string' ? businessName.trim().slice(0, KRA_BUSINESS_NAME_MAX) : '';
  if (!name) return { error: BUSINESS_NAME_ERROR };

  return { etims: { kraPin, businessName: name } };
}
