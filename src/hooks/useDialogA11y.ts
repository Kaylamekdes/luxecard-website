import { useEffect, useRef } from 'react';
import { useInert } from './useInert';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isVisible(el: HTMLElement) {
  return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
}

function focusableIn(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(isVisible);
}

// Shared behaviour for an overlay dialog (InquiryModal, ContactOptionsModal):
//   - while closed, everything inside the returned ref is `inert`: unreachable
//     by Tab and hidden from assistive tech, not just hidden with CSS
//   - on open, focus moves into the dialog (its first focusable element,
//     unless the caller already moves focus somewhere more specific)
//   - Tab/Shift+Tab are trapped inside it — always intercepted and moved by
//     hand while the dialog is open, so the rest of the page can't be
//     reached regardless of DOM order, with no need to make the rest of the
//     app inert too
//   - Escape closes it
//   - on close, focus returns to whatever had it before the dialog opened
//     (normally the button that opened it)
export function useDialogA11y<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const containerRef = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useInert(containerRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const raf = requestAnimationFrame(() => {
      focusableIn(container)[0]?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = focusableIn(container);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      // Always handled by hand (never left to the browser's default Tab),
      // so focus can't slip out to whatever is behind the dialog.
      e.preventDefault();
      if (e.shiftKey) {
        (currentIndex <= 0 ? last : focusable[currentIndex - 1]).focus();
      } else {
        (currentIndex === -1 || currentIndex === focusable.length - 1 ? first : focusable[currentIndex + 1]).focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const target = previouslyFocused.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [isOpen]);

  return containerRef;
}
