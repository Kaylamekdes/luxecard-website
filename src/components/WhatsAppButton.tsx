import { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext';
import { useNavMenu } from '../context/navMenuContext';
import { LINKS } from '../data/links';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TRANSITION_MS = 250;
// Dead band that stops the button flickering when a section's top edge sits
// right at the bottom of the screen: it hides once the section is this far
// into view, but only shows again once it has fully left the screen.
const HIDE_AFTER_PX = 32;

export function WhatsAppButton() {
  const [hidden, setHidden] = useState(false);
  const { isOpen: cartOpen } = useCart();
  const { isOpen: menuOpen } = useNavMenu();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // The Contact & Visit section (home page only) and the footer both hide
    // the button: it would otherwise sit on top of their content.
    const candidates: (Element | null)[] = [document.getElementById('contact'), document.querySelector('footer')];
    const targets = candidates.filter((el): el is Element => el !== null);
    if (targets.length === 0) return;

    const deepTargets = new Set<Element>(); // at least HIDE_AFTER_PX into view
    const anyTargets = new Set<Element>(); // at least partly in view
    const update = () =>
      setHidden((prev) => (deepTargets.size > 0 ? true : anyTargets.size > 0 ? prev : false));
    const track = (inView: Set<Element>) => (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      update();
    };

    const deepObserver = new IntersectionObserver(track(deepTargets), {
      rootMargin: `0px 0px -${HIDE_AFTER_PX}px 0px`,
    });
    const anyObserver = new IntersectionObserver(track(anyTargets));

    for (const target of targets) {
      deepObserver.observe(target);
      anyObserver.observe(target);
    }
    return () => {
      deepObserver.disconnect();
      anyObserver.disconnect();
    };
  }, []);

  return (
    <a
      href={LINKS.CONTACT}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      aria-hidden={hidden}
      // inert takes it out of the tab order and pointer hit-testing while hidden.
      inert={hidden}
      tabIndex={hidden ? -1 : undefined}
      className="fixed bottom-[calc(clamp(16px,4vw,28px)+var(--cookie-banner-h,0px))] right-[clamp(16px,4vw,28px)] z-[150] flex h-14 w-14 items-center justify-center rounded-full hover:-translate-y-0.5"
      style={{
        background: '#25D366',
        boxShadow: '0 14px 32px -10px rgba(0,0,0,.55)',
        opacity: hidden ? 0 : 1,
        // Reduced motion: fade only, no slide.
        transform: hidden && !reducedMotion ? 'translateY(12px)' : 'none',
        pointerEvents: hidden ? 'none' : 'auto',
        // visibility flips after the fade finishes when hiding, immediately when showing.
        visibility: hidden ? 'hidden' : 'visible',
        transition: `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out, visibility 0s linear ${hidden ? `${TRANSITION_MS}ms` : '0s'}`,
        filter: cartOpen || menuOpen ? 'blur(18px)' : 'none',
      }}
    >
      <svg viewBox="0 0 448 512" width="28" height="28" fill="#ffffff" aria-hidden="true">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.9l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
      </svg>
    </a>
  );
}
