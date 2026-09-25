import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { setLenis } from '../utils/lenisInstance';

/**
 * Drives momentum/inertia scrolling for the whole page and intercepts
 * in-page anchor clicks (nav, hero CTA) so they glide with the same
 * easing instead of the browser's linear scroll-behavior: smooth.
 * Renders nothing; skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    setLenis(lenis);

    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Land an incoming section hash (e.g. "/#products", from a nav link
    // clicked on another page) once the DOM has settled, using the same
    // Lenis instance as anchor clicks so it isn't fought over scroll
    // ownership by a plain window.scrollTo.
    let hashRafId: number | undefined;
    const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (hashTarget) {
      hashRafId = requestAnimationFrame(() => {
        const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 0;
        lenis.scrollTo(hashTarget as HTMLElement, { offset: -navHeight, duration: 1.4 });
      });
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 0;
      lenis.scrollTo(target as HTMLElement, { offset: -navHeight, duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      if (hashRafId !== undefined) cancelAnimationFrame(hashRafId);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
