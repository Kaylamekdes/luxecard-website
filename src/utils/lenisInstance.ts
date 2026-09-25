import type Lenis from 'lenis';

// SmoothScroll owns the page's Lenis instance. Other components that move the
// page programmatically (the portfolio's "Show less") go through it, so Lenis's
// own inertia can't fight their scrolling.
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;
