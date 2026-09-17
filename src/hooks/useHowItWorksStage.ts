import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

// How much scroll (in px) while the section is in view counts as one
// deliberate step, advancing or retreating the stage by one.
const SCROLL_STEP_PX = 320;

/**
 * Stage 0-3 for the "How It Works" phone demo, cycling continuously
 * (3 wraps back to 0, and vice versa) rather than resting once it
 * reaches either end. Auto-advances every 2600ms once the section is
 * >=40% visible, and ALSO tracks scroll distance while the section is
 * in view: every ~320px scrolled down moves the stage forward one
 * step, every ~320px scrolled up moves it back one step — the two
 * triggers run side by side, both simply nudging the same stage
 * counter. Clicking a stage locks manual control and cancels both.
 */
export function useHowItWorksStage(sectionRef: RefObject<HTMLElement | null>, autoAdvance = true) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(reduced ? 3 : 0);
  const lockedRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const lastScrollYRef = useRef(0);
  const scrollAccumRef = useRef(0);
  // Becomes true once the section first crosses the 40% visibility
  // threshold (the same moment the auto-timer starts). Scroll-driven
  // stage changes are gated behind this so the scroll gesture that
  // first brings the section into view can't itself skip past stage 0
  // before the timer (and the user) ever gets to see it.
  const enteredRef = useRef(false);

  useEffect(() => {
    if (reduced || !autoAdvance) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !timerRef.current && !lockedRef.current) {
            enteredRef.current = true;
            scrollAccumRef.current = 0;
            timerRef.current = window.setInterval(() => {
              setStage((s) => (s + 1) % 4);
            }, 2600);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;

      // Any part of the section on screen counts — deliberately more
      // lenient than the 40% threshold that starts the auto-timer, so
      // scrolling back up through the section (which shrinks its visible
      // share as it exits near the top) still tracks correctly. Gated by
      // enteredRef so this leniency only applies once the section has
      // properly arrived, not during the scroll gesture that first
      // reveals it.
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;

      if (lockedRef.current || !inView || !enteredRef.current) {
        scrollAccumRef.current = 0;
        return;
      }

      scrollAccumRef.current += delta;
      if (scrollAccumRef.current >= SCROLL_STEP_PX) {
        scrollAccumRef.current = 0;
        setStage((s) => (s + 1) % 4);
      } else if (scrollAccumRef.current <= -SCROLL_STEP_PX) {
        scrollAccumRef.current = 0;
        setStage((s) => (s - 1 + 4) % 4);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.clearInterval(timerRef.current);
      window.removeEventListener('scroll', onScroll);
      enteredRef.current = false;
    };
  }, [reduced, sectionRef, autoAdvance]);

  const select = useCallback((i: number) => {
    window.clearInterval(timerRef.current);
    timerRef.current = undefined;
    lockedRef.current = true;
    setStage(i);
  }, []);

  return { stage, select };
}
