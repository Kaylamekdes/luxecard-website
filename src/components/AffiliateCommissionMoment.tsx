import { useLiquidBorder } from '../hooks/useLiquidBorder';
import { RevealSection } from './RevealSection';

// Deliberately pink/orange/purple, not LuxeCard's gold accent: a one-off
// decorative flourish, not a brand color statement.
const COLOR_RING_GRADIENT =
  'conic-gradient(from var(--angle, 0deg), transparent 0deg, transparent 220deg, rgba(236,72,153,.9) 250deg, rgba(249,115,22,.95) 280deg, rgba(168,85,247,.9) 310deg, rgba(236,72,153,.5) 335deg, transparent 355deg, transparent 360deg)';
const COLOR_GLOW_GRADIENT = 'linear-gradient(90deg, rgba(236,72,153,.55), rgba(249,115,22,.55), rgba(168,85,247,.55))';

function ColorfulBorderGlow() {
  const ringRef = useLiquidBorder<HTMLDivElement>(55);

  return (
    <div className="relative mx-auto mt-[clamp(56px,9vh,104px)] h-20 w-full max-w-[440px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -bottom-6 h-12 rounded-full opacity-70 blur-2xl"
        style={{ background: COLOR_GLOW_GRADIENT }}
      />
      <div className="relative h-full w-full rounded-[26px] p-[2px]">
        <div
          ref={ringRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[26px]"
          style={{
            padding: '2px',
            background: COLOR_RING_GRADIENT,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div
          className="relative z-[1] h-full w-full rounded-[26px] bg-white"
          style={{ boxShadow: '0 20px 40px -20px rgba(11,11,13,.18)' }}
        />
      </div>
    </div>
  );
}

export function AffiliateCommissionMoment() {
  return (
    <RevealSection
      className="relative overflow-hidden bg-ivory px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center text-ink"
    >
      <div className="relative mx-auto max-w-[1000px]">
        <h2 className="m-0 font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          REFER. SHARE.
          <br />
          EARN 10%.
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(11,11,13,.62)]">
          On every order placed through your link.
        </p>

        <ColorfulBorderGlow />
      </div>
    </RevealSection>
  );
}
