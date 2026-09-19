import { Link2, TrendingUp, UserPlus, type LucideIcon } from 'lucide-react';
import { AFFILIATE_STEPS } from '../data/affiliate';
import { useReveal } from '../hooks/useReveal';
import { RevealSection } from './RevealSection';

const STEP_ICONS: LucideIcon[] = [UserPlus, Link2, TrendingUp];
const ICON_CENTER = 56; // card padding (28px) + half of the 56px icon circle

function RippleIcon({ Icon, visible, size }: { Icon: LucideIcon; visible: boolean; size: number }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      {visible &&
        [0, 0.7, 1.4].map((delay) => (
          <span
            key={delay}
            className="absolute inset-0 animate-lc-ripple rounded-full border"
            style={{ borderColor: 'rgba(253,211,3,.4)', animationDelay: `${delay}s` }}
          />
        ))}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors duration-500"
        style={{ borderColor: visible ? 'rgba(253,211,3,.5)' : 'rgba(255,255,255,.14)', background: '#0C0C0F' }}
      >
        <Icon size={size} strokeWidth={1.7} className="text-accent" aria-hidden="true" />
      </div>
    </div>
  );
}

function BentoCard({
  index,
  title,
  body,
  Icon,
  tall,
  floatDelay,
  gridClassName,
}: {
  index: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  tall?: boolean;
  floatDelay?: number;
  gridClassName: string;
}) {
  const { ref, style, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        ...style,
        background: 'radial-gradient(120% 100% at 50% 0%, #17171B 0%, #0C0C0E 60%)',
        boxShadow: '0 40px 70px -35px rgba(0,0,0,.85)',
      }}
      className={`relative z-[1] rounded-[26px] border border-[rgba(255,255,255,.1)] p-7 ${gridClassName} ${
        tall
          ? 'flex flex-col items-center justify-center gap-5 text-center'
          : 'flex items-center gap-5 text-left'
      }`}
    >
      <div
        className={floatDelay !== undefined ? 'animate-lc-float' : undefined}
        style={floatDelay !== undefined ? { animationDelay: `${floatDelay}s` } : undefined}
      >
        <RippleIcon Icon={Icon} visible={visible} size={tall ? 24 : 22} />
      </div>
      <div>
        <div className="font-inter text-[10px] font-medium tracking-[.14em] text-accent">{index}</div>
        <div className="mt-1 font-manrope text-[19px] font-semibold tracking-[-.02em] text-ivory">{title}</div>
        <p
          className={`m-0 mt-1.5 text-[14px] leading-[1.55] text-[rgba(243,240,234,.5)] ${
            tall ? 'max-w-[220px]' : 'max-w-[280px]'
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative col-start-2 col-span-2 row-start-1 row-span-2 hidden min-[900px]:block"
    >
      {/* Sits only in the row gap between the two right-hand cards, so it never
          renders under their opaque backgrounds, and reads as a highlight
          passing between the two icon nodes. */}
      <div className="absolute h-5 w-4" style={{ left: ICON_CENTER - 8, top: 'calc(50% - 10px)' }}>
        <div
          className="absolute inset-x-1/2 top-0 h-full w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(253,211,3,.65), transparent)' }}
        />
        <div
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 animate-lc-travel rounded-full"
          style={{
            background: 'radial-gradient(circle, #FFFDF5 0%, #FDD303 55%, transparent 75%)',
            boxShadow: '0 0 10px 2px rgba(253,211,3,.6)',
          }}
        />
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

        <div className="relative grid grid-cols-1 gap-4 min-[900px]:grid-cols-3 min-[900px]:grid-rows-2 min-[900px]:h-[540px]">
          <Connector />
          <BentoCard
            index={AFFILIATE_STEPS[0].index}
            title={AFFILIATE_STEPS[0].title}
            body={AFFILIATE_STEPS[0].body}
            Icon={STEP_ICONS[0]}
            tall
            floatDelay={0}
            gridClassName="min-[900px]:col-start-1 min-[900px]:row-span-2"
          />
          <BentoCard
            index={AFFILIATE_STEPS[1].index}
            title={AFFILIATE_STEPS[1].title}
            body={AFFILIATE_STEPS[1].body}
            Icon={STEP_ICONS[1]}
            gridClassName="min-[900px]:col-start-2 min-[900px]:col-span-2 min-[900px]:row-start-1"
          />
          <BentoCard
            index={AFFILIATE_STEPS[2].index}
            title={AFFILIATE_STEPS[2].title}
            body={AFFILIATE_STEPS[2].body}
            Icon={STEP_ICONS[2]}
            floatDelay={1.6}
            gridClassName="min-[900px]:col-start-2 min-[900px]:col-span-2 min-[900px]:row-start-2"
          />
        </div>
      </div>
    </RevealSection>
  );
}
