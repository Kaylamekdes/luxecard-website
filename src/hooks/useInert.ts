import { useEffect, type RefObject } from 'react';

// Removes an element and everything inside it from the tab order and from
// assistive technology while `active` is false, without changing how it
// looks. The pattern used to visually hide a closed panel elsewhere on this
// site (aria-hidden + opacity + pointer-events: none) doesn't stop Tab from
// reaching it; `inert` does, the same attribute a native <dialog> uses to
// disable the page behind it.
export function useInert(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [ref, active]);
}
