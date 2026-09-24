import { useEffect, useRef } from 'react';
import { runWhileActive } from '../utils/runWhileActive';
import { useReducedMotion } from './useReducedMotion';

/**
 * Applies a subtle vertical drift to the returned ref's element, proportional
 * to its own position relative to the viewport center — so it moves at a
 * slightly different rate than normal in-flow content around it, rather than
 * scrolling in lockstep. `speed` is small (±0.05–0.15): positive drifts the
 * element down as it approaches from below and up as it exits above: negative
 * reverses that. Skipped under prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement>(speed: number) {
  const reduced = useReducedMotion();
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (reduced || !speed) return;
    const el = ref.current;
    if (!el) return;

    // Only ticks while the element is within 400px of the viewport. When it
    // pauses it returns to rest (offset 0, still on its own layer) so a stale
    // far-off offset can never be on screen when it comes back into range.
    return runWhileActive(
      el,
      () => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      },
      { margin: 400, onStop: () => (el.style.transform = 'translate3d(0, 0, 0)') }
    );
  }, [speed, reduced]);

  return ref;
}
