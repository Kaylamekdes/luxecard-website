import { Link2, Percent, UserPlus, type LucideIcon } from 'lucide-react';
import { AFFILIATE_STEPS } from '../data/affiliate';
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
            'linear-gradient(to right, rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '20% 20%',
          WebkitMaskImage: 'radial-gradient(circle, #000 35%, transparent 75%)',
          maskImage: 'radial-gradient(circle, #000 35%, transparent 75%)',
        }}
      />
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-[10px] bg-white"
        style={{ border: '1.5px solid rgba(253,211,3,.55)', boxShadow: '0 6px 18px rgba(0,0,0,.14)' }}
      >
        <Icon size={20} strokeWidth={1.8} className="text-[#101013]" aria-hidden="true" />
      </div>
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
          <h2 className="m-0 shrink-0 font-manrope text-[clamp(38px,5.6vw,72px)] font-bold leading-none tracking-[-.032em] min-[900px]:whitespace-nowrap">
            HOW IT WORKS
          </h2>
          <p className="m-0 max-w-[320px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Three simple steps to start earning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-3">
          {AFFILIATE_STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div
                key={s.index}
                className="flex flex-col items-center gap-4 rounded-[22px] px-7 py-9 text-center"
                style={{ background: '#F5F5F5' }}
              >
                <StepGraphic Icon={Icon} />
                <div className="font-inter text-[11px] font-semibold tracking-[.14em] text-accent">{s.index}</div>
                <div className="font-manrope text-[20px] font-bold tracking-[-.02em] text-ink">{s.title}</div>
                <p className="m-0 max-w-[240px] text-[14.5px] leading-[1.5] text-[#4A4A4A]">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
