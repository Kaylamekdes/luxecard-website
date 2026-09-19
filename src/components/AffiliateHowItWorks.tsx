import { Link2, TrendingUp, UserPlus, type LucideIcon } from 'lucide-react';
import { AFFILIATE_STEPS } from '../data/affiliate';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

const STEP_ICONS: LucideIcon[] = [UserPlus, Link2, TrendingUp];

function Station({
  index,
  title,
  body,
  Icon,
  ripple,
}: {
  index: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  ripple: boolean;
}) {
  const { ref, style, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={style}
      className="relative z-[1] flex flex-1 flex-col items-center gap-4 text-center min-[900px]:flex-row min-[900px]:text-left"
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
        {ripple &&
          visible &&
          [0, 0.7, 1.4].map((delay) => (
            <span
              key={delay}
              className="absolute inset-0 animate-lc-ripple rounded-full border"
              style={{ borderColor: 'rgba(253,211,3,.4)', animationDelay: `${delay}s` }}
            />
          ))}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors duration-500"
          style={{
            borderColor: visible ? 'rgba(253,211,3,.5)' : 'rgba(255,255,255,.14)',
            background: '#0C0C0F',
          }}
        >
          <Icon size={22} strokeWidth={1.7} className="text-accent" aria-hidden="true" />
        </div>
      </div>
      <div>
        <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">{index}</div>
        <div className="mt-1 font-manrope text-[20px] font-semibold tracking-[-.02em] text-ivory">{title}</div>
        <p className="m-0 mt-1.5 max-w-[240px] text-[14.5px] leading-[1.55] text-[rgba(243,240,234,.5)]">{body}</p>
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

        <div className="relative flex flex-col gap-[clamp(40px,6vh,64px)] min-[900px]:flex-row min-[900px]:items-start min-[900px]:gap-8">
          {AFFILIATE_STEPS.map((s, i) => (
            <Station
              key={s.index}
              index={s.index}
              title={s.title}
              body={s.body}
              Icon={STEP_ICONS[i]}
              ripple={i === AFFILIATE_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
