import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

// How much downward scroll (in px) while the section is in view counts as
// one "light scroll" step, advancing the stage by one.
const SCROLL_STEP_PX = 130;

/**
 * Stage 0-3 for the "How It Works" phone demo. Auto-advances every
 * 2600ms once the section is >=40% visible, and ALSO advances one step
 * for each ~130px of downward scroll while the section is in view — the
 * two triggers run side by side and both simply push the stage forward.
 * Clicking a stage locks manual control and cancels both.
 */
export function useHowItWorksStage(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(reduced ? 3 : 0);
  const lockedRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const intersectingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollAccumRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const advance = () => {
      setStage((s) => {
        if (s >= 3) return s;
        return s + 1;
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !timerRef.current && !lockedRef.current) {
            timerRef.current = window.setInterval(() => {
              setStage((s) => {
                if (s >= 3) {
                  window.clearInterval(timerRef.current);
                  timerRef.current = undefined;
                  return s;
                }
                return s + 1;
              });
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

      if (lockedRef.current || !intersectingRef.current || delta <= 0) {
        scrollAccumRef.current = 0;
        return;
      }

      scrollAccumRef.current += delta;
      if (scrollAccumRef.current >= SCROLL_STEP_PX) {
        scrollAccumRef.current = 0;
        advance();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.clearInterval(timerRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced, sectionRef]);

  const select = useCallback((i: number) => {
    window.clearInterval(timerRef.current);
    timerRef.current = undefined;
    lockedRef.current = true;
    setStage(i);
  }, []);

  return { stage, select };
}
