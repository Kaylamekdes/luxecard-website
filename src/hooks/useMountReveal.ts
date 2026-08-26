import { useEffect, useState, type CSSProperties } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Fade + rise triggered on mount rather than on scroll, for content that's
 * already in the viewport on load (e.g. the hero) where an
 * IntersectionObserver would never fire.
 */
export function useMountReveal(delayMs = 0) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, [reduced]);

  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(32px)',
        transition: `opacity 1.1s ${delayMs}ms cubic-bezier(.16,1,.3,1), transform 1.25s ${delayMs}ms cubic-bezier(.16,1,.3,1)`,
      };

  return style;
}
