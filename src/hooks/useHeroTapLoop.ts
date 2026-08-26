import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

// [step, holdMs]
const SEQUENCE: [number, number][] = [
  [0, 900],
  [1, 1000],
  [2, 620],
  [3, 1200],
  [4, 2600],
  [5, 900],
];

/**
 * Drives the hero card -> tap -> phone loop. Steps 0-5 repeat; see
 * design_handoff README "Hero tap animation" for what each step renders.
 */
export function useHeroTapLoop() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? 4 : 0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const deadRef = useRef(false);
  const indexRef = useRef(0);

  const run = useCallback(() => {
    if (deadRef.current) return;
    const [s, holdMs] = SEQUENCE[indexRef.current];
    setStep(s);
    indexRef.current = (indexRef.current + 1) % SEQUENCE.length;
    timeoutRef.current = window.setTimeout(run, holdMs);
  }, []);

  useEffect(() => {
    if (reduced) {
      setStep(4);
      return;
    }
    deadRef.current = false;
    indexRef.current = 0;
    run();
    return () => {
      deadRef.current = true;
      window.clearTimeout(timeoutRef.current);
    };
  }, [reduced, run]);

  const replay = useCallback(() => {
    if (reduced) return;
    window.clearTimeout(timeoutRef.current);
    deadRef.current = true;
    setStep(0);
    window.setTimeout(() => {
      deadRef.current = false;
      indexRef.current = 0;
      run();
    }, 120);
  }, [reduced, run]);

  return { step, replay };
}
