import type { FormEvent } from 'react';

// Name of the hidden anti-bot field (see HoneypotField). Real visitors never
// see or fill it; bots that fill every input give themselves away.
export const HONEYPOT_NAME = 'hp_url';

// Call synchronously inside a form's submit handler.
export function readHoneypot(e: FormEvent): string {
  const form = e.currentTarget as HTMLFormElement;
  return (form.elements.namedItem(HONEYPOT_NAME) as HTMLInputElement | null)?.value ?? '';
}
