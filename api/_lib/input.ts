// Small helpers for validating what the public forms send. Everything from
// the browser is untrusted: trim it, cap its length, and check its shape.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_SHORT = 200;
export const MAX_MESSAGE = 2000;

// Returns the trimmed string, or '' for anything that isn't a string.
export function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function isEmail(value: string): boolean {
  return value.length <= MAX_SHORT && EMAIL_PATTERN.test(value);
}

// Hidden form field real people never fill in; bots that fill every field do.
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== '';
}

export function oneHourAgo(): string {
  return new Date(Date.now() - 60 * 60 * 1000).toISOString();
}
