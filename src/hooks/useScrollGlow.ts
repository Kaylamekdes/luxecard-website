import { useEffect, useRef } from 'react';
import { runWhileActive } from '../utils/runWhileActive';
import { useMediaQuery } from './useMediaQuery';
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
 *
 * `parallax` (default 0, opt-in) additionally drifts each glow vertically as
 * the section scrolls, proportional to the section's own position — a subtle
 * depth cue for sections that ask for it, without affecting the many other
 * consumers of this hook that don't pass it.
 *
 * Below 900px this is a no-op: the glow stays at its original constant
 * strength (just the CSS pulse, no scroll-driven brightening/dimming). A
 * mobile glow is already much smaller in absolute pixels than desktop's for
 * the same percentage width, so the same fixed blur radius dilutes it far
 * more there — throttling it down to RESTING_OPACITY for most of the scroll
 * journey (only reaching MAX_OPACITY when the section is precisely
 * centered) made it disappear on mobile entirely, even though the identical
 * throttling still reads fine on desktop's much bigger glow. The caller
 * should skip applying its own resting-opacity style whenever
 * `scrollResponsive` comes back false, so the glow renders exactly as it
 * did before this hook existed.
 */
export function useScrollGlow<T extends HTMLElement>(parallax = 0) {
  const reduced = useReducedMotion();
  const wide = useMediaQuery('(min-width: 900px)');
  const scrollResponsive = wide && !reduced;
  const sectionRef = useRef<T>(null);
  const glowRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!scrollResponsive) return;
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const referenceHeight = Math.min(rect.height, vh);
      const ratio = referenceHeight > 0 ? Math.min(1, visibleHeight / referenceHeight) : 0;
      const opacity = RESTING_OPACITY + ratio * (MAX_OPACITY - RESTING_OPACITY);
      const parallaxY = parallax ? (rect.top + rect.height / 2 - vh / 2) * parallax : 0;

      glowRefs.current.forEach((glow) => {
        if (!glow) return;
        glow.style.opacity = String(opacity);
        if (parallax) glow.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
      });
    };

    // Only ticks while the section is within 400px of the screen (the glow's
    // blur reaches well past its section, so start early); one last update
    // on the way out settles the glow at its resting state.
    return runWhileActive(section, update, { margin: 400, onStop: update });
  }, [scrollResponsive, parallax]);

  return { sectionRef, glowRefs, scrollResponsive };
}
