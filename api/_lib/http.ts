// A fetch with a hard timeout that reliably fires - a plain setTimeout-
// driven AbortController, not AbortSignal.timeout (see metaCapi.ts's own
// note: that timer isn't guaranteed to keep firing on its own in every
// runtime). Used for every outbound call to Paystack's API, so a hung
// response there can never leave one of our own requests hanging open
// until the platform's own function timeout eventually kills it.
export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
