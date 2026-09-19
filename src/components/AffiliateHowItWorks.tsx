import { Link2, TrendingUp, UserPlus, type LucideIcon } from 'lucide-react';
import { AFFILIATE_STEPS } from '../data/affiliate';
import { RevealSection } from './RevealSection';

const STEP_ICONS: LucideIcon[] = [UserPlus, Link2, TrendingUp];

export function AffiliateHowItWorks() {
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

        <div className="flex flex-col gap-[clamp(32px,5vh,48px)] min-[900px]:flex-row min-[900px]:gap-8">
          {AFFILIATE_STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={s.index} className="flex flex-1 items-start gap-4 text-left">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: 'rgba(255,255,255,.14)', background: '#0C0C0F' }}
                >
                  <Icon size={22} strokeWidth={1.7} className="text-accent" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">{s.index}</div>
                  <div className="mt-1 font-manrope text-[19px] font-semibold tracking-[-.02em] text-ivory">
                    {s.title}
                  </div>
                  <p className="m-0 mt-1.5 max-w-[260px] text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
