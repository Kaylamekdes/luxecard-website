import { PROBLEM } from '../data/content';
import { RevealSection } from './RevealSection';

export function Problem() {
  return (
    <RevealSection className="border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(90px,13vh,150px)]">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="m-0 mb-[clamp(44px,6vh,76px)] max-w-[900px] font-manrope text-[clamp(34px,5vw,68px)] font-bold leading-[.96] tracking-[-.032em]">
          NETWORKING SHOULD NOT
          <br />
          END WITH A HANDSHAKE.
        </h2>
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}
        >
          <div className="rounded-[18px] border border-[rgba(255,255,255,.07)] bg-surface p-[clamp(28px,3vw,44px)]">
            <div className="mb-7 font-inter text-[10px] font-medium tracking-[.15em] text-[#55534F]">
              THE OLD WAY
            </div>
            <div className="flex flex-col gap-3.5 font-manrope text-[clamp(20px,2.4vw,30px)] tracking-[-.03em] text-[rgba(243,240,234,.3)]">
              {PROBLEM.oldWay.map((line, i) => (
                <span key={line} className={i === PROBLEM.oldWay.length - 1 ? 'line-through decoration-1' : undefined}>
                  {line}
                </span>
              ))}
            </div>
          </div>
          <div
            className="rounded-[18px] border p-[clamp(28px,3vw,44px)]"
            style={{ borderColor: 'rgba(253,211,3,.22)', background: 'linear-gradient(160deg, #13120F, #0C0C0E 70%)' }}
          >
            <div className="mb-7 font-inter text-[10px] font-medium tracking-[.15em] text-accent">LUXECARD</div>
            <div className="flex flex-col gap-3.5 font-manrope text-[clamp(20px,2.4vw,30px)] tracking-[-.03em]">
              {PROBLEM.luxeCard.map((line, i) => (
                <span key={line} className={i === PROBLEM.luxeCard.length - 1 ? 'text-accent' : undefined}>
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
