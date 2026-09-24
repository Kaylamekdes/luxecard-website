import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Clock } from 'lucide-react';
import { useCart } from '../context/cartContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Field } from './FormField';
import { RevealSection } from './RevealSection';
import { readHoneypot } from '../utils/honeypot';
import { inputClass } from '../utils/inputClass';
import { HoneypotField } from './HoneypotField';

const signupInitialState = { fullName: '', email: '', phone: '', social: '' };

export function AffiliateSignupForm() {
  const { notify } = useCart();
  const reducedMotion = useReducedMotion();
  const [form, setForm] = useState(signupInitialState);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const update = <K extends keyof typeof signupInitialState>(key: K, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // The confirmation panel is shorter than the form, so swapping them
  // shrinks the section and shifts everything below it upward. Re-anchor
  // the viewport on this section's top so that shift doesn't read as a
  // jump to whatever content ends up under the old scroll position.
  useEffect(() => {
    if (!submitted) return;
    sectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [submitted, reducedMotion]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const hp = readHoneypot(e);
    setAttempted(true);
    if (!form.fullName || !form.email || !form.phone) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Could not complete signup.');

      setSubmitted(true);
      setForm(signupInitialState);
      setAttempted(false);
    } catch (err) {
      notify('Signup failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <RevealSection
        ref={sectionRef}
        id="affiliate-signup"
        className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
      >
        <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'rgba(253,211,3,.1)', border: '1px solid rgba(253,211,3,.3)' }}
          >
            <Clock size={28} strokeWidth={1.8} className="text-accent" aria-hidden="true" />
          </div>
          <h2 className="m-0 mt-8 font-manrope text-[clamp(28px,4vw,40px)] font-bold leading-[1.05] tracking-[-.03em]">
            Thanks for applying!
          </h2>
          <p className="m-0 mt-4 max-w-[440px] text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
            Your application is under review. We'll be in touch once you're approved, along with your
            referral link.
          </p>
        </div>
      </RevealSection>
    );
  }

  return (
    <RevealSection
      ref={sectionRef}
      id="affiliate-signup"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-[640px]">
        <div className="mb-10 text-center">
          <div className="mb-3 font-inter text-[10px] font-medium tracking-[.2em] text-accent">
            JOIN THE PROGRAM
          </div>
          <h2 className="m-0 mb-4 font-manrope text-[clamp(32px,4.4vw,52px)] font-bold leading-[1.02] tracking-[-.032em]">
            Become an Affiliate.
          </h2>
          <p className="m-0 text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.55)]">
            Tell us a bit about yourself and we'll set you up with your referral link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-[22px] border border-[rgba(255,255,255,.1)] p-[clamp(26px,4vw,42px)]"
          style={{ background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)' }}
        >
          <HoneypotField />
          <Field label="Full Name" required invalid={attempted && !form.fullName}>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className={inputClass(attempted && !form.fullName)}
              placeholder="Jane Doe"
            />
          </Field>

          <div className="grid gap-5 min-[560px]:grid-cols-2">
            <Field label="Email" required invalid={attempted && !form.email}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass(attempted && !form.email)}
                placeholder="jane@example.com"
              />
            </Field>
            <Field label="Phone" required invalid={attempted && !form.phone}>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass(attempted && !form.phone)}
                placeholder="+254 700 000000"
              />
            </Field>
          </div>

          <Field label="Social Media Handle" hint="Optional: Instagram, LinkedIn, TikTok, etc.">
            <input
              type="text"
              value={form.social}
              onChange={(e) => update('social', e.target.value)}
              className={inputClass()}
              placeholder="@yourhandle"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Get Your Link'}
          </button>
        </form>
      </div>
    </RevealSection>
  );
}
