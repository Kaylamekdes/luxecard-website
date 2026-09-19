import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Drives a continuously rotating --angle custom property on the returned
 * ref's element via requestAnimationFrame (not a CSS animation), so a
 * conic-gradient using `from var(--angle)` sweeps smoothly without relying
 * on @property support for animating custom properties.
 */
export function useLiquidBorder<T extends HTMLElement>(speedDegPerSec = 70) {
  const reduced = useReducedMotion();
  const elRef = useRef<T | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = elRef.current;
    if (!el) return;

    let rafId: number;
    let angle = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      angle = (angle + speedDegPerSec * dt) % 360;
      el.style.setProperty('--angle', `${angle}deg`);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [speedDegPerSec, reduced]);

  return elRef;
}
