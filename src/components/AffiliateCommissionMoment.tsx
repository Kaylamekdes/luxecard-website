import { RESTING_OPACITY, useScrollGlow } from '../hooks/useScrollGlow';
import { RevealSection } from './RevealSection';

export function AffiliateCommissionMoment() {
  const { sectionRef, glowRefs } = useScrollGlow<HTMLElement>();

  return (
    <RevealSection
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[rgba(255,255,255,.06)] px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center"
      style={{ background: 'radial-gradient(100% 80% at 50% 100%, #1A1915 0%, #0B0B0D 55%, #08080A 100%)' }}
    >
      <div
        aria-hidden="true"
        ref={(el) => {
          glowRefs.current[0] = el;
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: RESTING_OPACITY }}
      >
        <div
          className="h-full w-full animate-lc-glow rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(253,211,3,.35), transparent 70%)', mixBlendMode: 'screen' }}
        />
      </div>

      <div className="relative mx-auto max-w-[1000px]">
        <h2 className="m-0 font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          REFER. SHARE.
          <br />
          EARN <span className="text-accent">10%.</span>
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(243,240,234,.55)]">
          On every order placed through your link.
        </p>
      </div>
    </RevealSection>
  );
}
