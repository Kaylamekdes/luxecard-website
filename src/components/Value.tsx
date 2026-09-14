import { useEffect, useRef } from 'react';
import { VALUE_PILLARS, type ValuePillar } from '../data/content';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useReveal } from '../hooks/useReveal';

const STACK_SCALE = [1, 0.95, 0.9];
const SPREAD_START_VH = 0.85;
const SPREAD_DISTANCE_VH = 0.9;
const STAGGER_MS = 160;

export function Value() {
  const { ref, style } = useReveal<HTMLElement>();
  const mobile = useMediaQuery('(max-width: 767px)');

  return (
    <section
      ref={ref}
      style={style}
      className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(44px,6vh,76px)] flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
            MORE THAN A
            <br />
            BUSINESS CARD.
          </h2>
          <p className="m-0 max-w-[340px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">
            Your professional identity, designed to move with you.
          </p>
        </div>

        {mobile ? <MobileStack /> : <DesktopGrid />}
      </div>
    </section>
  );
}

function DesktopGrid() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="grid gap-[18px]"
      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}
    >
      {VALUE_PILLARS.map((pillar, i) => (
        <div
          key={pillar.num}
          className="rounded-[18px] border border-[rgba(255,255,255,.07)] bg-surface-raised p-[clamp(28px,3vw,40px)] hover:-translate-y-1.5 hover:border-[rgba(253,211,3,.3)] hover:bg-surface-hover"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? undefined : 'translateY(28px)',
            transition: `opacity .7s ${i * STAGGER_MS}ms cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1), border-color .6s cubic-bezier(.16,1,.3,1), background-color .6s cubic-bezier(.16,1,.3,1)`,
          }}
        >
          <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">{pillar.num}</div>
          <h3 className="mb-3 mt-11 font-manrope text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-.03em]">
            {pillar.title}
          </h3>
          <p className="m-0 text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">{pillar.body}</p>
        </div>
      ))}
    </div>
  );
}

function MobileStack() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * SPREAD_START_VH;
      const distance = vh * SPREAD_DISTANCE_VH;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));

      const baseTop = cardRefs.current[0]?.offsetTop ?? 0;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const naturalOffset = card.offsetTop - baseTop;
        const y = -naturalOffset * (1 - progress);
        const targetScale = STACK_SCALE[i] ?? 1;
        const scale = targetScale + (1 - targetScale) * progress;
        card.style.transform = `translateY(${y}px) scale(${scale})`;
        card.style.boxShadow =
          i > 0 ? `0 ${40 * (1 - progress) + 12}px ${70 * (1 - progress) + 20}px -30px rgba(0,0,0,${0.7 - progress * 0.4})` : '';
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [reduced]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-6">
      {VALUE_PILLARS.map((pillar, i) => (
        <StackCard
          key={pillar.num}
          pillar={pillar}
          index={i}
          cardRef={(el) => {
            cardRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

function StackCard({
  pillar,
  index,
  cardRef,
}: {
  pillar: ValuePillar;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={cardRef}
      className="mx-auto w-full max-w-[680px] rounded-[20px] border border-[rgba(255,255,255,.08)] bg-surface-raised p-[clamp(32px,4vw,48px)] transition-colors duration-500 hover:border-[rgba(253,211,3,.3)] hover:bg-surface-hover"
      style={{
        transform: `scale(${STACK_SCALE[index] ?? 1})`,
        boxShadow: index > 0 ? '0 52px 90px -30px rgba(0,0,0,.7)' : undefined,
        willChange: 'transform',
      }}
    >
      <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">{pillar.num}</div>
      <h3 className="mb-3 mt-11 font-manrope text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-.03em]">
        {pillar.title}
      </h3>
      <p className="m-0 text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">{pillar.body}</p>
    </div>
  );
}
