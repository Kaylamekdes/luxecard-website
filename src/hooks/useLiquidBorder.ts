import { useEffect, useRef } from 'react';
import { runWhileActive } from '../utils/runWhileActive';
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

    let angle = 0;
    let last = performance.now();

    // Pauses while the button is off-screen or the tab is hidden. The frame
    // time is capped so the first frame after a pause is a normal step
    // rather than a snap by however long it was paused.
    return runWhileActive(
      el,
      (now) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        angle = (angle + speedDegPerSec * dt) % 360;
        el.style.setProperty('--angle', `${angle}deg`);
      },
      { margin: 100 }
    );
  }, [speedDegPerSec, reduced]);

  return elRef;
}
