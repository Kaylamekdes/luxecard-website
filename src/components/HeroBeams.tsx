import { useReducedMotion } from '../hooks/useReducedMotion';

type Beam = { top: string; left: string; width: string; rotate: number; duration: number; delay: number };

const BEAMS: Beam[] = [
  { top: '6%', left: '-15%', width: '65%', rotate: -22, duration: 9, delay: 0 },
  { top: '30%', left: '8%', width: '78%', rotate: -17, duration: 11.5, delay: 2.4 },
  { top: '56%', left: '-18%', width: '68%', rotate: -25, duration: 10, delay: 5 },
  { top: '80%', left: '2%', width: '58%', rotate: -19, duration: 12.5, delay: 1.1 },
];

/**
 * Decorative, non-interactive background layer for hero sections: a slow
 * ambient glow that breathes in intensity, plus a handful of translucent
 * diagonal gold beams that continuously sweep, widen/narrow and fade.
 * Render as the first child of a `relative` section, with sibling content
 * given `relative z-[1]` so it paints above this layer.
 */
export function HeroBeams() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-0 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/3 animate-lc-glow rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(253,211,3,.16), transparent 70%)' }}
      />

      {BEAMS.map((b, i) => (
        <div
          key={i}
          className="absolute h-px"
          style={{ top: b.top, left: b.left, width: b.width, transform: `rotate(${b.rotate}deg)` }}
        >
          <div
            className="h-[2px] w-full animate-lc-beam rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(253,211,3,.6) 45%, rgba(255,244,214,.85) 50%, rgba(253,211,3,.6) 55%, transparent)',
              filter: 'blur(1.5px)',
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
