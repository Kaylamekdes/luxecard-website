// Runs `tick` once per animation frame, but only while `el` is on screen
// (or within `margin` px of it) and the tab is visible. Off-screen or
// backgrounded, the loop is cancelled outright instead of ticking for nothing,
// which keeps decorative effects from burning CPU/GPU for the life of the page.
// `onStop` runs each time the loop pauses, so an effect can settle on its
// resting state.
export function runWhileActive(
  el: Element,
  tick: (now: number) => void,
  { margin = 0, onStop }: { margin?: number; onStop?: () => void } = {}
): () => void {
  let onScreen = false;
  let running = false;
  let rafId = 0;

  const frame = (now: number) => {
    tick(now);
    rafId = requestAnimationFrame(frame);
  };

  const sync = () => {
    const shouldRun = onScreen && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      // Apply the effect right away instead of waiting a frame, so coming
      // back into range (e.g. after a big scroll jump) never shows stale values.
      tick(performance.now());
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(rafId);
      onStop?.();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      sync();
    },
    { rootMargin: `${margin}px 0px` }
  );
  observer.observe(el);
  document.addEventListener('visibilitychange', sync);

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    cancelAnimationFrame(rafId);
    running = false;
  };
}
