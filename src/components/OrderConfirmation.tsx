import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { clearCartItems } from '../utils/cartStorage';

type ConfirmationState = 'checking' | 'paid' | 'unconfirmed';

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 1500;

function getReferenceFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('reference') ?? params.get('trxref');
}

// Reached via Paystack's callback_url after checkout. The webhook (server to
// server) is the source of truth for actually recording the order, but it
// can land slightly after this redirect — so this page polls a small
// status endpoint rather than assuming success just from being loaded.
export function OrderConfirmation() {
  const [reference] = useState(getReferenceFromUrl);
  const [state, setState] = useState<ConfirmationState>(reference ? 'checking' : 'unconfirmed');

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;

    const poll = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const res = await fetch(`/api/order-status?reference=${encodeURIComponent(reference)}`);
          const data = await res.json();
          if (data?.paid) {
            if (!cancelled) {
              clearCartItems();
              setState('paid');
            }
            return;
          }
        } catch {
          // ignore and retry
        }
        if (attempt < MAX_ATTEMPTS - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
      if (!cancelled) setState('unconfirmed');
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (state === 'checking') {
    return (
      <main className="flex min-h-[100vh] flex-col items-center justify-center px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] text-center">
        <Loader2 size={28} strokeWidth={1.8} className="animate-spin text-accent" aria-hidden="true" />
        <p className="m-0 mt-6 text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
          Confirming your payment…
        </p>
      </main>
    );
  }

  if (state === 'unconfirmed') {
    return (
      <main className="flex min-h-[100vh] flex-col items-center justify-center px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)' }}
        >
          <XCircle size={28} strokeWidth={1.8} className="text-[#F87171]" aria-hidden="true" />
        </div>
        <h1 className="m-0 mt-8 font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.03em]">
          We couldn't confirm your payment.
        </h1>
        <p className="m-0 mt-4 max-w-[440px] text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
          If you completed payment, it may still be processing — check back in a few minutes. Otherwise your
          cart is still saved and ready whenever you want to try again.
        </p>
        <a
          href="/?checkout=cancelled"
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
        >
          Return to your cart
        </a>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100vh] flex-col items-center justify-center px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'rgba(253,211,3,.1)', border: '1px solid rgba(253,211,3,.3)' }}
      >
        <CheckCircle2 size={28} strokeWidth={1.8} className="text-accent" aria-hidden="true" />
      </div>
      <h1 className="m-0 mt-8 font-manrope text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-.03em]">
        Thank you! Your order is confirmed.
      </h1>
      <p className="m-0 mt-4 max-w-[440px] text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
        We'll reach out within 24 hours to discuss your card design. Cards are processed and finished within 3
        days after that.
      </p>
      <a
        href="/"
        className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
      >
        Back to Home
      </a>
    </main>
  );
}
