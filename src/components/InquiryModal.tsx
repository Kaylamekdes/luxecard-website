import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';
import { BUSINESS_FORMSPREE_ENDPOINT, FORMSPREE_ENDPOINT } from '../data/formspree';
import type { InquiryTab } from '../context/inquiryModalContext';

type Finish = 'plastic' | 'wood' | 'metallic' | '';
type MetallicColor = 'silver' | 'black' | 'gold' | '';
type WoodFinish = 'natural' | 'cherry' | 'black' | '';
type BusinessFinish = 'plastic' | 'wood' | 'metallic';
type CardVolume = '1-10' | '11-50' | '50+' | '';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const FINISHES: { value: Finish; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

const METALLIC_COLORS: { value: MetallicColor; label: string }[] = [
  { value: 'silver', label: 'Silver' },
  { value: 'black', label: 'Black' },
  { value: 'gold', label: 'Gold' },
];

const WOOD_FINISHES: { value: WoodFinish; label: string }[] = [
  { value: 'natural', label: 'Natural' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'black', label: 'Black' },
];

const BUSINESS_FINISHES: { value: BusinessFinish; label: string }[] = [
  { value: 'plastic', label: 'Plastic' },
  { value: 'wood', label: 'Wood' },
  { value: 'metallic', label: 'Metallic' },
];

const CARD_VOLUMES: { value: CardVolume; label: string }[] = [
  { value: '1-10', label: '1 – 10' },
  { value: '11-50', label: '11 – 50' },
  { value: '50+', label: '50+' },
];

const individualInitialState = {
  fullName: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  finish: '' as Finish,
  metallicColor: '' as MetallicColor,
  woodFinish: '' as WoodFinish,
};

const businessInitialState = {
  organization: '',
  contactName: '',
  email: '',
  phone: '',
  cardVolume: '' as CardVolume,
  finishes: [] as BusinessFinish[],
  metallicColor: '' as MetallicColor,
  woodFinish: '' as WoodFinish,
  message: '',
};

export function InquiryModal({
  isOpen,
  preselectedTab,
  onClose,
}: {
  isOpen: boolean;
  preselectedTab: InquiryTab;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<InquiryTab>(preselectedTab);
  const panelRef = useRef<HTMLDivElement>(null);
  const individualFirstFieldRef = useRef<HTMLInputElement>(null);
  const businessFirstFieldRef = useRef<HTMLInputElement>(null);

  const [individualForm, setIndividualForm] = useState(individualInitialState);
  const [individualStatus, setIndividualStatus] = useState<Status>('idle');
  const [businessForm, setBusinessForm] = useState(businessInitialState);
  const [businessStatus, setBusinessStatus] = useState<Status>('idle');

  useEffect(() => {
    if (isOpen) setTab(preselectedTab);
  }, [isOpen, preselectedTab]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const ref = tab === 'individual' ? individualFirstFieldRef : businessFirstFieldRef;
    const raf = requestAnimationFrame(() => ref.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isOpen, tab]);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setIndividualForm(individualInitialState);
        setIndividualStatus('idle');
        setBusinessForm(businessInitialState);
        setBusinessStatus('idle');
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const updateIndividual = <K extends keyof typeof individualInitialState>(
    key: K,
    value: (typeof individualInitialState)[K]
  ) => {
    setIndividualForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBusiness = <K extends keyof typeof businessInitialState>(
    key: K,
    value: (typeof businessInitialState)[K]
  ) => {
    setBusinessForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBusinessFinish = (finish: BusinessFinish) => {
    setBusinessForm((prev) => {
      const nowSelected = !prev.finishes.includes(finish);
      const finishes = nowSelected ? [...prev.finishes, finish] : prev.finishes.filter((f) => f !== finish);
      return {
        ...prev,
        finishes,
        metallicColor: finishes.includes('metallic') ? prev.metallicColor : '',
        woodFinish: finishes.includes('wood') ? prev.woodFinish : '',
      };
    });
  };

  const handleIndividualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!individualForm.fullName || !individualForm.email || !individualForm.finish) return;
    if (individualForm.finish === 'metallic' && !individualForm.metallicColor) return;
    if (individualForm.finish === 'wood' && !individualForm.woodFinish) return;

    setIndividualStatus('submitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: individualForm.fullName,
          title: individualForm.title,
          company: individualForm.company,
          email: individualForm.email,
          phone: individualForm.phone,
          finish: individualForm.finish,
          metallicColor: individualForm.metallicColor,
          woodFinish: individualForm.woodFinish,
        }),
      });
      setIndividualStatus(res.ok ? 'success' : 'error');
    } catch {
      setIndividualStatus('error');
    }
  };

  const handleBusinessSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!businessForm.organization || !businessForm.contactName || !businessForm.email) return;
    if (businessForm.finishes.includes('metallic') && !businessForm.metallicColor) return;
    if (businessForm.finishes.includes('wood') && !businessForm.woodFinish) return;

    setBusinessStatus('submitting');

    try {
      const res = await fetch(BUSINESS_FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'Business Inquiry',
          organization: businessForm.organization,
          contactName: businessForm.contactName,
          email: businessForm.email,
          phone: businessForm.phone,
          cardVolume: businessForm.cardVolume,
          finishes: businessForm.finishes.join(', '),
          metallicColor: businessForm.metallicColor,
          woodFinish: businessForm.woodFinish,
          message: businessForm.message,
        }),
      });
      setBusinessStatus(res.ok ? 'success' : 'error');
    } catch {
      setBusinessStatus('error');
    }
  };

  const activeStatus = tab === 'individual' ? individualStatus : businessStatus;

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
        aria-label={tab === 'individual' ? 'Order your LuxeCard' : 'Equip your team'}
        className="relative max-h-[88dvh] w-full max-w-[520px] overflow-y-auto rounded-[22px] border border-[rgba(255,255,255,.1)] p-[clamp(26px,4vw,42px)] shadow-2xl transition-transform duration-300 ease-lux"
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

        {activeStatus !== 'success' && (
          <div className="relative mb-7 mt-10 grid grid-cols-2 rounded-full border border-[rgba(255,255,255,.12)] bg-[rgba(255,255,255,.03)] p-1">
            <div
              aria-hidden="true"
              className="absolute inset-y-1 left-1 right-1/2 rounded-full bg-[#F3F0EA] transition-transform duration-300 ease-lux"
              style={{ transform: tab === 'individual' ? 'translateX(0%)' : 'translateX(100%)' }}
            />
            <TabButton active={tab === 'individual'} onClick={() => setTab('individual')}>
              For Myself
            </TabButton>
            <TabButton active={tab === 'business'} onClick={() => setTab('business')}>
              For My Team
            </TabButton>
          </div>
        )}

        <div className={tab === 'individual' ? undefined : 'hidden'}>
          <IndividualPanel
            form={individualForm}
            update={updateIndividual}
            setForm={setIndividualForm}
            status={individualStatus}
            onSubmit={handleIndividualSubmit}
            firstFieldRef={individualFirstFieldRef}
            onCloseSuccess={onClose}
          />
        </div>

        <div className={tab === 'business' ? undefined : 'hidden'}>
          <BusinessPanel
            form={businessForm}
            update={updateBusiness}
            toggleFinish={toggleBusinessFinish}
            status={businessStatus}
            onSubmit={handleBusinessSubmit}
            firstFieldRef={businessFirstFieldRef}
            onCloseSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative z-10 flex items-center justify-center whitespace-nowrap rounded-full py-2.5 text-[13.5px] font-medium transition-colors duration-300"
      style={{ color: active ? '#0B0B0D' : 'rgba(243,240,234,.6)' }}
    >
      {children}
    </button>
  );
}

function IndividualPanel({
  form,
  update,
  setForm,
  status,
  onSubmit,
  firstFieldRef,
  onCloseSuccess,
}: {
  form: typeof individualInitialState;
  update: <K extends keyof typeof individualInitialState>(key: K, value: (typeof individualInitialState)[K]) => void;
  setForm: (updater: (prev: typeof individualInitialState) => typeof individualInitialState) => void;
  status: Status;
  onSubmit: (e: FormEvent) => void;
  firstFieldRef: RefObject<HTMLInputElement | null>;
  onCloseSuccess: () => void;
}) {
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center py-[clamp(20px,4vh,40px)] text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[24px] text-ink">
          ✓
        </div>
        <h3 className="m-0 mb-3 font-manrope text-[clamp(22px,3vw,28px)] font-bold tracking-[-.02em]">
          You're all set.
        </h3>
        <p className="m-0 max-w-[360px] text-[15.5px] leading-[1.6] text-[rgba(243,240,234,.6)]">
          Thanks! We'll be in touch within 24 hours to finalize your card.
        </p>
        <button
          type="button"
          onClick={onCloseSuccess}
          className="mt-8 rounded-full bg-ivory px-7 py-[13px] text-[14.5px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7">
        <div className="mb-2 font-inter text-[10.5px] font-medium tracking-[.14em] text-accent">
          CREATE YOUR LUXECARD
        </div>
        <h3 className="m-0 font-manrope text-[clamp(24px,3.2vw,30px)] font-bold leading-[1.05] tracking-[-.025em]">
          Tell us about you.
        </h3>
        <p className="m-0 mt-3 text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
          A few details and we'll get your card into production.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field label="Full Name" required>
          <input
            ref={firstFieldRef}
            type="text"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </Field>

        <div className="grid gap-5 min-[560px]:grid-cols-2">
          <Field label="Title / Role">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className={inputClass}
              placeholder="Founder"
            />
          </Field>
          <Field label="Company">
            <input
              type="text"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className={inputClass}
              placeholder="Acme Inc."
            />
          </Field>
        </div>

        <div className="grid gap-5 min-[560px]:grid-cols-2">
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

        <Field label="Finish" required>
          <div className="flex flex-wrap gap-2.5">
            {FINISHES.map((f) => (
              <ChoiceChip
                key={f.value}
                label={f.label}
                selected={form.finish === f.value}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    finish: f.value,
                    metallicColor: f.value === 'metallic' ? prev.metallicColor : '',
                    woodFinish: f.value === 'wood' ? prev.woodFinish : '',
                  }))
                }
              />
            ))}
          </div>
        </Field>

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-[450ms] ease-lux"
          style={{
            maxHeight: form.finish === 'metallic' ? '120px' : '0px',
            opacity: form.finish === 'metallic' ? 1 : 0,
          }}
        >
          <Field label="Metallic Color" required={form.finish === 'metallic'}>
            <div className="flex flex-wrap gap-2.5">
              {METALLIC_COLORS.map((c) => (
                <ChoiceChip
                  key={c.value}
                  label={c.label}
                  selected={form.metallicColor === c.value}
                  onClick={() => update('metallicColor', c.value)}
                />
              ))}
            </div>
          </Field>
        </div>

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-[450ms] ease-lux"
          style={{
            maxHeight: form.finish === 'wood' ? '120px' : '0px',
            opacity: form.finish === 'wood' ? 1 : 0,
          }}
        >
          <Field label="Wood Finish" required={form.finish === 'wood'}>
            <div className="flex flex-wrap gap-2.5">
              {WOOD_FINISHES.map((w) => (
                <ChoiceChip
                  key={w.value}
                  label={w.label}
                  selected={form.woodFinish === w.value}
                  onClick={() => update('woodFinish', w.value)}
                />
              ))}
            </div>
          </Field>
        </div>

        {status === 'error' && (
          <p className="m-0 text-[13.5px] leading-[1.5] text-[#ff8a8a]">
            Something went wrong sending your request. Please try again, or email us directly at{' '}
            <a href="mailto:sales@luxecard.co.ke" className="underline">
              sales@luxecard.co.ke
            </a>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-ivory px-7 py-[15px] text-[15px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white disabled:pointer-events-none disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Add to Cart'}
        </button>
      </form>
    </>
  );
}

function BusinessPanel({
  form,
  update,
  toggleFinish,
  status,
  onSubmit,
  firstFieldRef,
  onCloseSuccess,
}: {
  form: typeof businessInitialState;
  update: <K extends keyof typeof businessInitialState>(key: K, value: (typeof businessInitialState)[K]) => void;
  toggleFinish: (finish: BusinessFinish) => void;
  status: Status;
  onSubmit: (e: FormEvent) => void;
  firstFieldRef: RefObject<HTMLInputElement | null>;
  onCloseSuccess: () => void;
}) {
  if (status === 'success') {
    return (
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
          onClick={onCloseSuccess}
          className="mt-8 rounded-full bg-ivory px-7 py-[13px] text-[14.5px] font-semibold text-ink transition-transform duration-300 ease-lux hover:-translate-y-0.5 hover:bg-white"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7">
        <div className="mb-2 font-inter text-[10.5px] font-medium tracking-[.14em] text-accent">EQUIP YOUR TEAM</div>
        <h3 className="m-0 font-manrope text-[clamp(24px,3.2vw,30px)] font-bold leading-[1.05] tracking-[-.025em]">
          Tell us about your team.
        </h3>
        <p className="m-0 mt-3 text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
          A few details and we'll follow up with a plan for your organization.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
            {BUSINESS_FINISHES.map((f) => (
              <label
                key={f.value}
                className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,.14)] px-4 py-2 text-[13.5px] font-medium text-[rgba(243,240,234,.78)] transition-colors duration-300 has-[:checked]:border-accent has-[:checked]:bg-[rgba(253,211,3,.12)] has-[:checked]:text-accent"
              >
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

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-[450ms] ease-lux"
          style={{
            maxHeight: form.finishes.includes('metallic') ? '120px' : '0px',
            opacity: form.finishes.includes('metallic') ? 1 : 0,
          }}
        >
          <Field label="Metallic Color" required={form.finishes.includes('metallic')}>
            <div className="flex flex-wrap gap-2.5">
              {METALLIC_COLORS.map((c) => (
                <ChoiceChip
                  key={c.value}
                  label={c.label}
                  selected={form.metallicColor === c.value}
                  onClick={() => update('metallicColor', c.value)}
                />
              ))}
            </div>
          </Field>
        </div>

        <div
          className="overflow-hidden transition-[max-height,opacity] duration-[450ms] ease-lux"
          style={{
            maxHeight: form.finishes.includes('wood') ? '120px' : '0px',
            opacity: form.finishes.includes('wood') ? 1 : 0,
          }}
        >
          <Field label="Wood Finish" required={form.finishes.includes('wood')}>
            <div className="flex flex-wrap gap-2.5">
              {WOOD_FINISHES.map((w) => (
                <ChoiceChip
                  key={w.value}
                  label={w.label}
                  selected={form.woodFinish === w.value}
                  onClick={() => update('woodFinish', w.value)}
                />
              ))}
            </div>
          </Field>
        </div>

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
            <a href="mailto:sales@luxecard.co.ke" className="underline">
              sales@luxecard.co.ke
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
