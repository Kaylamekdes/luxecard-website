import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { BUSINESS_FORMSPREE_ENDPOINT } from '../data/formspree';

type Finish = 'plastic' | 'wood' | 'metallic';
type CardVolume = '1-10' | '11-50' | '50+' | '';

const FINISHES: { value: Finish; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

const CARD_VOLUMES: { value: CardVolume; label: string }[] = [
  { value: '1-10', label: '1–10' },
  { value: '11-50', label: '11–50' },
  { value: '50+', label: '50+' },
];

const initialState = {
  organization: '',
  contactName: '',
  email: '',
  phone: '',
  cardVolume: '' as CardVolume,
  finishes: [] as Finish[],
  message: '',
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function BusinessInquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<Status>('idle');
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const raf = requestAnimationFrame(() => firstFieldRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setForm(initialState);
        setStatus('idle');
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const update = <K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFinish = (finish: Finish) => {
    setForm((prev) => ({
      ...prev,
      finishes: prev.finishes.includes(finish)
        ? prev.finishes.filter((f) => f !== finish)
        : [...prev.finishes, finish],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.organization || !form.contactName || !form.email) return;

    setStatus('submitting');

    try {
      const res = await fetch(BUSINESS_FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'Business Inquiry',
          organization: form.organization,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          cardVolume: form.cardVolume,
          finishes: form.finishes.join(', '),
          message: form.message,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ease-lux min-[900px]:p-6"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        background: 'rgba(8,8,10,.82)',
        backdropFilter: 'blur(14px) saturate(140%)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Equip your team"
        className="relative max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-[22px] border border-[rgba(255,255,255,.1)] p-[clamp(26px,4vw,42px)] shadow-2xl transition-transform duration-300 ease-lux"
        style={{
          background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(.97)',
          boxShadow: '0 40px 90px -30px rgba(0,0,0,.7)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,.14)] text-[15px] text-[rgba(243,240,234,.7)] transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center py-[clamp(20px,4vh,40px)] text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[24px] text-ink">
              ✓
            </div>
            <h3 className="m-0 mb-3 font-manrope text-[clamp(22px,3vw,28px)] font-bold tracking-[-.02em]">
              Inquiry sent.
            </h3>
            <p className="m-0 max-w-[360px] text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
              Thanks! Our sales team will reach out shortly to discuss your order.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full bg-ivory px-7 py-[13px] text-[14.5px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-7 pr-8">
              <div className="mb-2 font-inter text-[10.5px] font-medium tracking-[.14em] text-accent">
                EQUIP YOUR TEAM
              </div>
              <h3 className="m-0 font-manrope text-[clamp(24px,3.2vw,30px)] font-bold leading-[1.05] tracking-[-.025em]">
                Tell us about your team.
              </h3>
              <p className="m-0 mt-3 text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
                A few details and we'll follow up with a plan for your organization.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Organization Name" required>
                <input
                  ref={firstFieldRef}
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => update('organization', e.target.value)}
                  className={inputClass}
                  placeholder="Acme Inc."
                />
              </Field>

              <div className="grid gap-5 min-[560px]:grid-cols-2">
                <Field label="Contact Person Name" required>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => update('contactName', e.target.value)}
                    className={inputClass}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className={inputClass}
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
              </div>

              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                  placeholder="jane@acme.com"
                />
              </Field>

              <Field label="Approximate Number of Cards">
                <div className="flex flex-wrap gap-2.5">
                  {CARD_VOLUMES.map((v) => (
                    <ChoiceChip
                      key={v.value}
                      label={v.label}
                      selected={form.cardVolume === v.value}
                      onClick={() => update('cardVolume', form.cardVolume === v.value ? '' : v.value)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Finishes Needed">
                <div className="flex flex-wrap gap-2.5">
                  {FINISHES.map((f) => (
                    <label key={f.value} className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,.14)] px-4 py-2 text-[13.5px] font-medium text-[rgba(243,240,234,.78)] transition-colors duration-300 has-[:checked]:border-accent has-[:checked]:bg-[rgba(253,211,3,.12)] has-[:checked]:text-accent">
                      <input
                        type="checkbox"
                        checked={form.finishes.includes(f.value)}
                        onChange={() => toggleFinish(f.value)}
                        className="sr-only"
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Message / Notes">
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className={`${inputClass} min-h-[96px] resize-y`}
                  placeholder="Anything else we should know?"
                />
              </Field>

              {status === 'error' && (
                <p className="m-0 text-[13.5px] leading-[1.5] text-[#ff8a8a]">
                  Something went wrong sending your request. Please try again, or email us directly at{' '}
                  <a href="mailto:luxecardke@gmail.com" className="underline">
                    luxecardke@gmail.com
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white disabled:pointer-events-none disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[rgba(255,255,255,.14)] bg-[rgba(255,255,255,.03)] px-4 py-3 text-[15px] text-ivory placeholder:text-[rgba(243,240,234,.28)] outline-none transition-colors duration-300 focus:border-accent';

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-inter text-[11px] font-medium tracking-[.1em] text-grey-1">
        {label.toUpperCase()}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}

function ChoiceChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors duration-300"
      style={{
        borderColor: selected ? '#FDD303' : 'rgba(255,255,255,.14)',
        background: selected ? 'rgba(253,211,3,.12)' : 'transparent',
        color: selected ? '#FDD303' : 'rgba(243,240,234,.78)',
      }}
    >
      {label}
    </button>
  );
}
