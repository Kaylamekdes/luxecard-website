import { useReducedMotion } from '../hooks/useReducedMotion';
import { RevealSection } from './RevealSection';

const POOLS: { left: string; color: string; delay: string }[] = [
  { left: '10%', color: '#2563EB', delay: '-1.05s' },
  { left: '30%', color: '#7C3AED', delay: '-0.55s' },
  { left: '50%', color: '#EC4899', delay: '-0.15s' },
  { left: '70%', color: '#FDD303', delay: '0.35s' },
  { left: '90%', color: '#14B8A6', delay: '0.75s' },
];

// No dark backdrop and no boxed "container" — the light sweep sits directly
// on the plain white/ivory section, full width edge to edge. The pools use
// multiply so they read as soft ambient tints; the line/halo render at full
// saturation so the sweep itself stays vivid and legible on the light bg.
function EdgeLightSweep() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] overflow-hidden">
      {POOLS.map((p, i) => (
        <div
          key={i}
          className="edge-sweep-pool"
          style={{ left: p.left, background: p.color, animationDelay: p.delay }}
        />
      ))}
      <div className="edge-sweep-halo" />
      <div className="edge-sweep-line" />
    </div>
  );
}

export function AffiliateCommissionMoment() {
  return (
    <RevealSection className="relative overflow-hidden bg-ivory px-[clamp(20px,4vw,48px)] py-[clamp(100px,16vh,190px)] text-center text-ink">
      <div className="relative mx-auto max-w-[1000px]">
        <h2 className="m-0 font-manrope text-[clamp(40px,7vw,96px)] font-extrabold leading-[.97] tracking-[-.035em]">
          REFER. SHARE.
          <br />
          <span className="text-accent">EARN</span> 10%.
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(11,11,13,.62)]">
          On every order placed through your link.
        </p>
      </div>

      <EdgeLightSweep />
    </RevealSection>
  );
}
