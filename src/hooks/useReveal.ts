import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Per-section scroll reveal: rise + fade + slight scale-in, triggered once
 * the element's top passes ~88% of viewport height. Each section owns its
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
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf1);
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
        transform: visible ? 'none' : 'translateY(46px) scale(.975)',
        transition: 'opacity 1.15s cubic-bezier(.16,1,.3,1), transform 1.3s cubic-bezier(.16,1,.3,1)',
        willChange: 'opacity, transform',
      };

  return { ref, style };
}
