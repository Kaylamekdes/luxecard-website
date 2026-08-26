import { PROFESSIONAL_CHIPS, PROFESSIONAL_PHOTOS } from '../data/content';
import { RevealSection } from './RevealSection';

export function Professionals() {
  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] bg-bg-alt px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(40px,5vh,64px)] flex flex-wrap items-end justify-between gap-5">
          <h2 className="m-0 font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
            MAKE EVERY
            <br />
            INTRODUCTION COUNT.
          </h2>
          <div className="flex max-w-[420px] flex-wrap gap-2">
            {PROFESSIONAL_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[rgba(255,255,255,.1)] px-3.5 py-2 font-inter text-[10px] tracking-[.14em] text-grey-1"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
          {PROFESSIONAL_PHOTOS.map((caption, i) => (
            <div
              key={caption}
              aria-hidden="true"
              className="flex aspect-[3/4] items-end rounded-2xl border border-[rgba(255,255,255,.07)] p-5"
              style={{
                background: 'repeating-linear-gradient(45deg, #15151A 0 14px, #101015 14px 28px)',
                transform: i === 1 ? 'translateY(clamp(0px, 3vw, 40px))' : undefined,
              }}
            >
              <span className="whitespace-pre-line font-inter text-[9.5px] leading-[1.7] tracking-[.1em] text-grey-1">
                {caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
