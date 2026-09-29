import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { onScrollToTop } from './scrollTopReset';
import { useReducedMotion } from './useReducedMotion';

const INTERVAL_MS = 4200;
const EXIT_MS = 400;
const ENTER_MS = 550;
const PRICE_MS = 320;

type Phase = 'in' | 'exiting' | 'entering';
type Direction = 1 | -1;

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
 *
 * `goToNext`/`goToPrev` step the index manually (wrapping in either
 * direction) using this same transition, and pause the automatic timer —
 * so a card the visitor is actively browsing never advances out from under
 * them. `sectionRef` is watched to resume the timer once the section
 * leaves the viewport entirely (either direction) or the visitor scrolls
 * back to the top, matching a fresh load's default (auto-cycling).
 */
export function useAutoCycle(length: number, sectionRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('in');
  const [paused, setPaused] = useState(false);
  const directionRef = useRef<Direction>(1);

  useEffect(() => {
    if (length <= 1 || paused) return;

    if (reduced) {
      const id = setInterval(() => setIndex((i) => (i + 1) % length), INTERVAL_MS);
      return () => clearInterval(id);
    }

    const id = setInterval(() => {
      // Only start a new exit if the previous cycle has fully settled —
      // guards against overlapping cycles if a transitionend was ever missed.
      setPhase((p) => {
        if (p !== 'in') return p;
        directionRef.current = 1;
        return 'exiting';
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [length, reduced, paused]);

  // Resume auto-cycling once the section is fully out of view in either
  // direction, or the visitor scrolls all the way back to the top — the
  // same "start fresh" moment useReveal re-arms on.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPaused(false);
    }, { threshold: 0 });
    observer.observe(section);
    const unsubscribe = onScrollToTop(() => setPaused(false));
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [sectionRef]);

  const onCardTransitionEnd = useCallback(() => {
    if (phase === 'exiting') {
      setIndex((i) => (i + directionRef.current + length) % length);
      setPhase('entering');
    } else if (phase === 'entering') {
      setPhase('in');
    }
  }, [phase, length]);

  // Ignored mid-transition (phase !== 'in') rather than queued, same as the
  // auto-timer's own guard — a card already animating finishes its current
  // move before the next one starts.
  const goTo = useCallback(
    (dir: Direction) => {
      if (length <= 1 || phase !== 'in') return;
      setPaused(true);
      directionRef.current = dir;
      if (reduced) {
        setIndex((i) => (i + dir + length) % length);
      } else {
        setPhase('exiting');
      }
    },
    [length, phase, reduced]
  );

  const goToNext = useCallback(() => goTo(1), [goTo]);
  const goToPrev = useCallback(() => goTo(-1), [goTo]);

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
    goToNext,
    goToPrev,
  };
}
