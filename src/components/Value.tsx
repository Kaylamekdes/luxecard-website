import { VALUE_PILLARS } from '../data/content';
import { RevealSection } from './RevealSection';

export function Value() {
  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
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
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
          {VALUE_PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="rounded-[18px] border border-[rgba(255,255,255,.07)] bg-surface-raised p-[clamp(28px,3vw,40px)] transition-[transform,border-color,background-color] duration-[.6s] ease-lux hover:-translate-y-1.5 hover:border-[rgba(253,211,3,.3)] hover:bg-surface-hover"
            >
              <div className="font-inter text-[10px] font-medium tracking-[.15em] text-accent">{pillar.num}</div>
              <h3 className="mb-3 mt-11 font-manrope text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-.03em]">
                {pillar.title}
              </h3>
              <p className="m-0 text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.52)]">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
