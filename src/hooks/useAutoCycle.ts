import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const INTERVAL_MS = 4200;
const EXIT_MS = 350;
const ENTER_MS = 550;
const PRICE_DELAY_MS = ENTER_MS + 80;
const PRICE_MS = 320;

/**
 * Cycles an index through [0, length) on a timer. Each switch runs a staged
 * sequence: the outgoing card exits, the new one slides in (`cardIn`), and
 * only once it's settled does the price reveal (`priceIn`) — rather than
 * everything changing as one flat crossfade.
 * Under prefers-reduced-motion the index still advances but both stay
 * true throughout (no animation).
 */
export function useAutoCycle(length: number) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [cardIn, setCardIn] = useState(true);
  const [priceIn, setPriceIn] = useState(true);

  useEffect(() => {
    if (length <= 1) return;

    if (reduced) {
      const id = setInterval(() => setIndex((i) => (i + 1) % length), INTERVAL_MS);
      return () => clearInterval(id);
    }

    let enterTimeout: ReturnType<typeof setTimeout>;
    let priceTimeout: ReturnType<typeof setTimeout>;

    const id = setInterval(() => {
      setCardIn(false);
      setPriceIn(false);
      enterTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % length);
        setCardIn(true);
        priceTimeout = setTimeout(() => setPriceIn(true), PRICE_DELAY_MS);
      }, EXIT_MS);
    }, INTERVAL_MS);

    return () => {
      clearInterval(id);
      clearTimeout(enterTimeout);
      clearTimeout(priceTimeout);
    };
  }, [length, reduced]);

  return {
    index,
    cardIn: reduced ? true : cardIn,
    priceIn: reduced ? true : priceIn,
    exitMs: EXIT_MS,
    enterMs: ENTER_MS,
    priceMs: PRICE_MS,
  };
}
