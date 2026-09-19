import { useState, type FormEvent } from 'react';
import { AFFILIATE_FAQS, AFFILIATE_STEPS } from '../data/affiliate';
import { AFFILIATE_FORMSPREE_ENDPOINT } from '../data/formspree';
import { useCart } from '../context/cartContext';
import { useMountReveal } from '../hooks/useMountReveal';
import { FaqAccordion } from './FaqAccordion';
import { Field } from './FormField';
import { inputClass } from '../utils/inputClass';
import { HeroTapVisual } from './HeroTapVisual';
import { RevealSection } from './RevealSection';

function AffiliateHero() {
  const textStyle = useMountReveal(80);
  const visualStyle = useMountReveal(280);

  return (
    <section
      id="top"
      className="relative px-[clamp(20px,4vw,48px)] pb-[clamp(64px,9vh,120px)] pt-[clamp(36px,calc(15vh-84px),96px)] min-[900px]:pt-[clamp(24px,calc(15vh-80px),84px)]"
      style={{ background: 'radial-gradient(120% 90% at 78% 10%, #16161A 0%, #0B0B0D 46%, #08080A 100%)' }}
    >
      <div
        className="mx-auto grid max-w-[1320px] items-center gap-[clamp(48px,6vw,80px)]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}
      >
        <div style={textStyle}>
          <div className="mb-5 font-inter text-[10px] font-medium tracking-[.2em] text-accent">
            AFFILIATE PROGRAM
          </div>
          <h1 className="m-0 mb-7 font-manrope text-[clamp(38px,6.4vw,80px)] font-extrabold leading-[.98] tracking-[-.035em]">
            Earn With Every <span className="text-accent">Introduction</span> You Make.
          </h1>

          <p className="m-0 mb-10 max-w-[460px] text-[clamp(16px,1.35vw,19px)] leading-[1.5] text-[rgba(243,240,234,.6)] text-pretty min-[900px]:leading-[1.55]">
            Share LuxeCard with your network and earn 10% commission on every order placed through your unique
            referral link. No inventory, no selling: just introductions.
          </p>

          <div className="flex flex-wrap items-center gap-x-[clamp(10px,4vw,24px)] gap-y-4">
            <a
              href="#affiliate-signup"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ivory px-[clamp(16px,5vw,30px)] py-[clamp(12px,3.5vw,17px)] text-[clamp(12.5px,3.2vw,15.5px)] font-semibold text-bg transition-[transform,box-shadow] duration-[.4s] ease-lux hover:-translate-y-[3px]"
              style={{ boxShadow: '0 18px 44px -22px rgba(243,240,234,.6)' }}
            >
              Become an Affiliate
            </a>
            <a
              href="#affiliate-how"
              className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap border-b border-[rgba(255,255,255,.14)] py-[15px] text-[clamp(12.5px,3.2vw,15.5px)] text-[rgba(243,240,234,.78)] transition-colors duration-300 hover:border-accent hover:text-ivory"
            >
              See How It Works <span className="font-inter">→</span>
            </a>
          </div>
        </div>

        <div style={visualStyle}>
          <HeroTapVisual />
        </div>
      </div>
    </section>
  );
}

function AffiliateHowItWorks() {
  return (
    <RevealSection
      id="affiliate-how"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(48px,7vh,88px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 font-manrope text-[clamp(38px,5.6vw,72px)] font-bold leading-none tracking-[-.032em]">
            HOW IT
            <br className="hidden min-[900px]:block" />
            <span className="min-[900px]:hidden"> </span>
            WORKS
          </h2>
          <p className="m-0 max-w-[320px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Three simple steps to start earning.
          </p>
        </div>

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}
        >
          {AFFILIATE_STEPS.map((s) => (
            <div
              key={s.index}
              className="grid items-start gap-4 rounded-[14px] border px-5 py-[22px]"
              style={{
                gridTemplateColumns: '44px 1fr',
                background: 'rgba(253,211,3,.07)',
                borderColor: 'rgba(253,211,3,.28)',
              }}
            >
              <span className="pt-1 font-inter text-[11px] tracking-[.1em] text-accent">{s.index}</span>
              <span>
                <span className="block font-manrope text-[clamp(20px,2.2vw,27px)] font-medium tracking-[-.03em] text-ivory">
                  {s.title}
                </span>
                <span className="mt-1.5 block text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
                  {s.body}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

function CommissionCallout() {
  return (
    <RevealSection
      className="relative overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(80px,12vh,140px)] text-center"
      style={{ background: 'radial-gradient(120% 90% at 50% 20%, #16161A 0%, #0B0B0D 55%, #08080A 100%)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(253,211,3,.22), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-[720px]">
        <div className="font-inter text-[10px] font-medium tracking-[.2em] text-accent">THE AFFILIATE PROGRAM</div>
        <div className="mt-4 font-manrope text-[clamp(88px,16vw,180px)] font-extrabold leading-none tracking-[-.04em] text-accent">
          10%
        </div>
        <p className="m-0 mt-5 text-[clamp(18px,2.2vw,26px)] font-medium leading-[1.4] text-ivory">
          Commission on every order placed through your referral link.
        </p>
        <p className="m-0 mt-4 text-[15px] leading-[1.6] text-[rgba(243,240,234,.55)]">
          No caps. No complicated tiers. Just a straightforward cut of every sale you send our way.
        </p>
      </div>
    </RevealSection>
  );
}

const signupInitialState = { fullName: '', email: '', phone: '', social: '' };

function AffiliateSignupForm() {
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
      className="scroll-mt-[84px] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
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

function AffiliateFaqSection() {
  return (
    <RevealSection
      id="affiliate-faqs"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-[1000px]">
        <h2 className="m-0 mb-[clamp(36px,5vh,60px)] font-manrope text-[clamp(32px,4.4vw,58px)] font-bold leading-[.98] tracking-[-.032em]">
          QUESTIONS,
          <br />
          ANSWERED.
        </h2>
        <FaqAccordion faqs={AFFILIATE_FAQS} />
      </div>
    </RevealSection>
  );
}

export function AffiliateProgram() {
  return (
    <main className="pt-[84px] min-[900px]:pt-[80px]">
      <AffiliateHero />
      <AffiliateHowItWorks />
      <CommissionCallout />
      <AffiliateSignupForm />
      <AffiliateFaqSection />
    </main>
  );
}
