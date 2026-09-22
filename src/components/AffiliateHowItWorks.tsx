import { Link2, Percent, UserPlus, type LucideIcon } from 'lucide-react';
import { AFFILIATE_STEPS } from '../data/affiliate';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

const STEP_ICONS: LucideIcon[] = [UserPlus, Link2, Percent];

function StepGraphic({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '20% 20%',
          WebkitMaskImage: 'radial-gradient(circle, #000 35%, transparent 75%)',
          maskImage: 'radial-gradient(circle, #000 35%, transparent 75%)',
        }}
      />
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-[10px]"
        style={{ background: '#0C0C0F', border: '1.5px solid rgba(253,211,3,.55)', boxShadow: '0 6px 18px rgba(0,0,0,.35)' }}
      >
        <Icon size={20} strokeWidth={1.8} className="text-accent" aria-hidden="true" />
      </div>
    </div>
  );
}

function AffiliateStepCard({ s, Icon }: { s: (typeof AFFILIATE_STEPS)[number]; Icon: LucideIcon }) {
  const { ref, style } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-4 rounded-[22px] border border-[rgba(255,255,255,.1)] px-7 py-9 text-center"
      style={{
        ...style,
        background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)',
        boxShadow: '0 40px 70px -35px rgba(0,0,0,.85)',
      }}
    >
      <StepGraphic Icon={Icon} />
      <div className="font-inter text-[11px] font-semibold tracking-[.14em] text-accent">{s.index}</div>
      <div className="font-manrope text-[20px] font-bold tracking-[-.02em] text-ivory">{s.title}</div>
      <p className="m-0 max-w-[240px] text-[14.5px] leading-[1.5] text-[rgba(243,240,234,.5)]">{s.body}</p>
    </div>
  );
}

export function AffiliateHowItWorks() {
  return (
    <RevealSection
      id="affiliate-how"
      className="scroll-mt-[84px] border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)] min-[900px]:scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(48px,7vh,88px)] flex flex-wrap items-end justify-between gap-6">
          <h2
            className="m-0 shrink-0 font-manrope text-[clamp(38px,5.6vw,72px)] font-bold leading-none tracking-[-.032em] min-[900px]:whitespace-nowrap"
            style={{ wordSpacing: '.18em' }}
          >
            HOW IT WORKS
          </h2>
          <p className="m-0 max-w-[320px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Three simple steps to start earning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-3">
          {AFFILIATE_STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return <AffiliateStepCard key={s.index} s={s} Icon={Icon} />;
          })}
        </div>
      </div>
    </RevealSection>
  );
}
