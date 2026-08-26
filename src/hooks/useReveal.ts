import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Per-section scroll reveal: 28px rise + fade in, triggered once the
 * element's top passes ~88% of viewport height. Each section owns its
 * own observer (rather than a shared imperative one) so a parent
 * re-render can never strand a section at opacity: 0.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    if (el.getBoundingClientRect().top <= window.innerHeight * 0.88) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1)',
      };

  return { ref, style };
}
