// A single shared "scrolled back to the top" signal, so every useReveal
// instance doesn't need its own scroll listener (there can be dozens on one
// page — every section heading, panel and portfolio card). Fires only on
// the edge: reaching the very top after having left it, not on every scroll
// tick, so a page that loads already at the top doesn't fire immediately.
const NEAR_TOP_PX = 4;

type Listener = () => void;

const listeners = new Set<Listener>();
let wasAtTop = typeof window !== 'undefined' ? window.scrollY <= NEAR_TOP_PX : true;
let attached = false;

function handleScroll() {
  const atTop = window.scrollY <= NEAR_TOP_PX;
  if (atTop && !wasAtTop) {
    listeners.forEach((fn) => fn());
  }
  wasAtTop = atTop;
}

export function onScrollToTop(fn: Listener): () => void {
  listeners.add(fn);
  if (!attached) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    attached = true;
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && attached) {
      window.removeEventListener('scroll', handleScroll);
      attached = false;
    }
  };
}
