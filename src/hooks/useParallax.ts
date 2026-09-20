import { useEffect, useRef } from 'react';
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

    let rafId: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > -400 && rect.top < window.innerHeight + 400) {
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [speed, reduced]);

  return ref;
}
