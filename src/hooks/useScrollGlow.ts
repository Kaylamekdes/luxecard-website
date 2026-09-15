import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

// Caps how bright the glow gets at its most-centered point, so it never
// blazes at full strength — only ever a subtle lift over the resting glow.
const MAX_OPACITY = 0.75;
export const RESTING_OPACITY = 0.35;

/**
 * Drives a section's ambient background glow by how centered the section
 * currently is in the viewport: brightest while centered, dimming smoothly
 * as it scrolls toward either edge or off-screen, and brightening again if
 * the user scrolls back. Consumers attach `sectionRef` to the section and
 * register each glow element via `glowRefs.current[i] = el`.
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
      const sectionCenter = rect.top + rect.height / 2;
      const maxDistance = vh / 2 + rect.height / 2;
      const distance = Math.abs(sectionCenter - vh / 2);
      const intensity = maxDistance > 0 ? Math.min(1, Math.max(0, 1 - distance / maxDistance)) : 0;
      const opacity = intensity * MAX_OPACITY;

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
