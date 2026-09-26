// The visitor's cookie choice for non-essential (advertising) cookies, i.e.
// the Meta Pixel. Nothing non-essential loads until this is 'accepted'.
// Stored per browser; the footer's "Cookie settings" link reopens the banner
// so the choice can be changed at any time.
export type ConsentChoice = 'accepted' | 'rejected';

const STORAGE_KEY = 'luxecard_cookie_consent';
const CHANGE_EVENT = 'luxecard:consent-change';
const OPEN_SETTINGS_EVENT = 'luxecard:open-cookie-settings';

export function getConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

export function hasAdConsent(): boolean {
  return getConsent() === 'accepted';
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage unavailable (private mode etc.): the choice still applies for
    // this page view via the event below, it just won't be remembered.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CHANGE_EVENT, { detail: choice }));
}

export function onConsentChange(listener: (choice: ConsentChoice) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<ConsentChoice>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(listener: () => void): () => void {
  window.addEventListener(OPEN_SETTINGS_EVENT, listener);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, listener);
}
