const STORAGE_KEY = 'luxecard_referral_code';

// Affiliate links point people here with ?ref=CODE. Captured once on
// landing and persisted, since checkout can happen in a later visit/session.
export function captureReferralCode() {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem(STORAGE_KEY, ref);
  } catch {
    // ignore unavailable storage
  }
}

export function getReferralCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
