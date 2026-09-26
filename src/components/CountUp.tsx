import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CountUpProps {
  from: number;
  to: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

// Ease-in-out: a soft start, a steady glide through the middle and a gentle
// landing, so the count reads as one smooth sweep rather than a jump that
// then crawls (which is how a plain ease-out feels over a large range).
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Counts from `from` up to `to` once the number is well into view. An
 * invisible copy of the final value sits in the same grid cell so the
 * surrounding text never shifts as digits are added mid-count. Reduced
 * motion lands straight on the final value.
 */
export function CountUp({ from, to, suffix = '', durationMs = 2400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let timer: number | undefined;
    let raf: number | undefined;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setValue(from + (to - from) * easeInOutSine(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Let the section's own fade-in settle before the count starts.
        timer = window.setTimeout(run, 250);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [from, to, durationMs, reduced]);

  const final = `${to}${suffix}`;

  return (
    <span ref={ref} aria-label={final} className={`inline-grid justify-items-center ${className ?? ''}`}>
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {final}
      </span>
      <span aria-hidden="true" className="[grid-area:1/1]">
        {Math.round(value)}
        {suffix}
      </span>
    </span>
  );
}
