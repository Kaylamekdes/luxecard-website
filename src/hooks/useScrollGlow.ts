import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

// The glow's opacity swings between these two values based on how much of
// the section is on screen — wide enough that the brightening/dimming is
// clearly noticeable, but capped below full strength so it never blazes.
const MAX_OPACITY = 0.85;
export const RESTING_OPACITY = 0.15;

/**
 * Drives a section's ambient background glow by how much of the section is
 * currently visible in the viewport: brightest while it's substantially on
 * screen, dimming smoothly as it scrolls off in either direction, and
 * brightening again if the user scrolls back. Using a visibility RATIO
 * (rather than distance from the exact viewport center) means short
 * sections — like this one is on mobile — reach full brightness for a
 * sustained stretch of the scroll instead of only at one precise point,
 * which is what makes the effect read as responsive on small screens.
 * Consumers attach `sectionRef` to the section and register each glow
 * element via `glowRefs.current[i] = el`.
 */
export function useScrollGlow<T extends HTMLElement>() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<T>(null);
  const glowRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const referenceHeight = Math.min(rect.height, vh);
      const ratio = referenceHeight > 0 ? Math.min(1, visibleHeight / referenceHeight) : 0;
      const opacity = RESTING_OPACITY + ratio * (MAX_OPACITY - RESTING_OPACITY);

      glowRefs.current.forEach((glow) => {
        if (glow) glow.style.opacity = String(opacity);
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [reduced]);

  return { sectionRef, glowRefs };
}
