import { useReducedMotion } from '../hooks/useReducedMotion';
import { RevealSection } from './RevealSection';

const POOLS: { left: string; color: string; delay: string }[] = [
  { left: '23%', color: '#303F49', delay: '-1.05s' },
  { left: '36%', color: '#2F323C', delay: '-0.55s' },
  { left: '50%', color: '#6A4D41', delay: '-0.15s' },
  { left: '63%', color: '#3F5A46', delay: '0.35s' },
  { left: '77%', color: '#24202B', delay: '0.75s' },
];

// No boxed "container" — the light sweep is anchored straight to the
// section's own bottom edge, over a soft dark fade that blends up into the
// ivory background (the dark backdrop the screen-blended layers need to
// read against, without a visible panel shape).
function EdgeLightSweep() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] overflow-hidden"
      style={{ background: 'linear-gradient(to top, rgba(33,33,33,.92) 0%, rgba(33,33,33,.45) 55%, transparent 100%)' }}
    >
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
          EARN 10%.
        </h2>
        <p className="m-0 mt-[26px] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[rgba(11,11,13,.62)]">
          On every order placed through your link.
        </p>
      </div>

      <EdgeLightSweep />
    </RevealSection>
  );
}
