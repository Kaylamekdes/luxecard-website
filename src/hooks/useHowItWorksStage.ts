import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Stage 0-3 for the "How It Works" phone demo. Auto-advances every
 * 2600ms once the section is >=40% visible; clicking a stage locks
 * manual control and cancels the auto-advance timer.
 */
export function useHowItWorksStage(sectionRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(reduced ? 3 : 0);
  const lockedRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
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
    return () => {
      io.disconnect();
      window.clearInterval(timerRef.current);
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
