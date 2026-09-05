import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const INTERVAL_MS = 4200;
const EXIT_MS = 400;
const ENTER_MS = 550;
const PRICE_MS = 320;

type Phase = 'in' | 'exiting' | 'entering';

/**
 * Cycles an index through [0, length) on a timer, driving a strictly
 * sequential exit -> swap -> enter -> reveal-price state machine so the
 * outgoing and incoming card never overlap. Phase advances are driven by
 * the caller reporting real `transitionend` events (via `onCardTransitionEnd`)
 * rather than mirrored setTimeout durations, so there's no risk of the
 * content swapping before the exit transition has actually finished
 * painting.
 * Under prefers-reduced-motion the index still advances but everything
 * stays visible throughout (no animation, no transitionend to wait for).
 */
export function useAutoCycle(length: number) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('in');

  useEffect(() => {
    if (length <= 1) return;

    if (reduced) {
      const id = setInterval(() => setIndex((i) => (i + 1) % length), INTERVAL_MS);
      return () => clearInterval(id);
    }

    const id = setInterval(() => {
      // Only start a new exit if the previous cycle has fully settled —
      // guards against overlapping cycles if a transitionend was ever missed.
      setPhase((p) => (p === 'in' ? 'exiting' : p));
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [length, reduced]);

  const onCardTransitionEnd = useCallback(() => {
    if (phase === 'exiting') {
      setIndex((i) => (i + 1) % length);
      setPhase('entering');
    } else if (phase === 'entering') {
      setPhase('in');
    }
  }, [phase, length]);

  const cardIn = reduced ? true : phase !== 'exiting';
  const priceIn = reduced ? true : phase === 'in';

  return {
    index,
    cardIn,
    priceIn,
    exitMs: EXIT_MS,
    enterMs: ENTER_MS,
    priceMs: PRICE_MS,
    onCardTransitionEnd,
  };
}
