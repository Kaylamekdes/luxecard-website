import { useState, type FormEvent } from 'react';
import { AFFILIATE_FORMSPREE_ENDPOINT } from '../data/formspree';
import { useCart } from '../context/cartContext';
import { Field } from './FormField';
import { RevealSection } from './RevealSection';
import { inputClass } from '../utils/inputClass';

const signupInitialState = { fullName: '', email: '', phone: '', social: '' };

export function AffiliateSignupForm() {
  const { notify } = useCart();
  const [form, setForm] = useState(signupInitialState);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof typeof signupInitialState>(key: K, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!form.fullName || !form.email || !form.phone) return;

    setSubmitting(true);
    try {
      await fetch(AFFILIATE_FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // Network errors are not surfaced; the site still confirms locally.
    }

    notify('You’re on the list!', "We'll be in touch with your referral link and next steps.");
    setForm(signupInitialState);
    setAttempted(false);
    setSubmitting(false);
  };

  return (
    <RevealSection
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
            {submitting ? 'Submitting…' : 'Join the Affiliate Program'}
          </button>
        </form>
      </div>
    </RevealSection>
  );
}
