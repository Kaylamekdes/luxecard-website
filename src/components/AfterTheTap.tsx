import { AFTER_THE_TAP } from '../data/content';
import { RevealSection } from './RevealSection';

export function AfterTheTap() {
  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="m-0 mb-[clamp(40px,6vh,72px)] max-w-[820px] font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
          THE INTRODUCTION
          <br />
          DOESN’T HAVE TO END THERE.
        </h2>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))' }}>
          {AFTER_THE_TAP.map((step) => {
            const isLast = step.num === '05';
            return (
              <div
                key={step.num}
                className="rounded-[14px] border px-[22px] py-[26px]"
                style={
                  isLast
                    ? { borderColor: 'rgba(253,211,3,.24)', background: 'linear-gradient(160deg, #14130F, #0C0C0E 70%)' }
                    : { borderColor: 'rgba(255,255,255,.07)', background: '#0C0C0E' }
                }
              >
                <div className="font-inter text-[9.5px] font-medium tracking-[.15em] text-accent">{step.num}</div>
                <div
                  className="mt-[34px] font-manrope text-[21px] tracking-[-.03em]"
                  style={{ color: isLast ? '#FDD303' : undefined }}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        <p className="m-0 mt-7 max-w-[520px] text-[16.5px] leading-[1.6] text-[rgba(243,240,234,.45)]">
          Digital identity, not just a card — with profile insights where your plan supports them.
        </p>
      </div>
    </RevealSection>
  );
}
