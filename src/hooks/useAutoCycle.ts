import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const INTERVAL_MS = 4200;
const FADE_MS = 700;

/**
 * Cycles an index through [0, length) on a timer, holding `visible` low for
 * FADE_MS around each switch so callers can crossfade their content.
 * Under prefers-reduced-motion the index still advances but visible stays
 * true throughout (no fade).
 */
export function useAutoCycle(length: number) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (length <= 1) return;

    if (reduced) {
      const id = setInterval(() => setIndex((i) => (i + 1) % length), INTERVAL_MS);
      return () => clearInterval(id);
    }

    let fadeInTimeout: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setVisible(false);
      fadeInTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);

    return () => {
      clearInterval(id);
      clearTimeout(fadeInTimeout);
    };
  }, [length, reduced]);

  return { index, visible: reduced ? true : visible, fadeMs: FADE_MS };
}
