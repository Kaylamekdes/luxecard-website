// KEEP IN SYNC with api/_lib/kra.ts: that is the server-side copy of this same
// rule (the server can't import from src/). If the PIN format or the limits
// change, change both files.

export const KRA_PIN_PATTERN = /^[A-Z][0-9]{9}[A-Z]$/;
export const KRA_PIN_LENGTH = 11; // one letter, nine digits, one letter
export const KRA_PIN_ERROR = 'Enter a valid KRA PIN, e.g. P051234567X';
export const BUSINESS_NAME_ERROR = 'Enter the business name as registered with KRA';
export const KRA_BUSINESS_NAME_MAX = 200;

// Uppercases and strips any whitespace, so " p051 234567x " becomes "P051234567X".
export function normalizeKraPin(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

export function isValidKraPin(value: string): boolean {
  return KRA_PIN_PATTERN.test(normalizeKraPin(value));
}
