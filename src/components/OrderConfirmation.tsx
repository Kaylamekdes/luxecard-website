import { CheckCircle2 } from 'lucide-react';

// Reached via Paystack's callback_url after checkout. The webhook (server to
// server) is the source of truth for actually recording the order — this
// page is purely the customer-facing "thank you" moment.
export function OrderConfirmation() {
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
