import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

const SPREAD_START_VH = 0.85;
const SPREAD_DISTANCE_VH = 0.8;

export function stackScale(index: number) {
  return Math.max(0.8, 1 - index * 0.05);
}

/**
 * Drives a scroll-scrubbed "stacked deck spreads into a row/column"
 * effect: items start overlapping at the first item's position and
 * fan out to their natural layout position as the container scrolls
 * through a fixed window relative to the viewport. `axis` picks
 * whether items spread horizontally (translateX) or vertically
 * (translateY). Consumers attach `containerRef` to the flex/grid
 * wrapper and register each item via `cardRefs.current[i] = el`.
 */
export function useScrollSpread(axis: 'x' | 'y') {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    const offsetProp = axis === 'x' ? 'offsetLeft' : 'offsetTop';

    // Cache viewport height instead of reading window.innerHeight on every
    // frame: mobile browsers shrink/grow it as their address bar hides and
    // shows mid-scroll, which would otherwise shift the trigger window and
    // make the reverse-scroll animation jump instead of tracking smoothly.
    let vh = window.innerHeight;
    const onResize = () => {
      vh = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    const update = () => {
      const rect = container.getBoundingClientRect();
      const start = vh * SPREAD_START_VH;
      const distance = vh * SPREAD_DISTANCE_VH;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));

      const base = cardRefs.current[0]?.[offsetProp] ?? 0;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const naturalOffset = card[offsetProp] - base;
        const translate = -naturalOffset * (1 - progress);
        const targetScale = stackScale(i);
        const scale = targetScale + (1 - targetScale) * progress;
        card.style.transform =
          axis === 'x' ? `translateX(${translate}px) scale(${scale})` : `translateY(${translate}px) scale(${scale})`;
        card.style.boxShadow =
          i > 0 ? `0 ${40 * (1 - progress) + 12}px ${70 * (1 - progress) + 20}px -30px rgba(0,0,0,${0.7 - progress * 0.4})` : '';
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [reduced, axis]);

  return { containerRef, cardRefs };
}
