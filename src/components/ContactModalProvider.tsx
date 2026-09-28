import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react';
import { ContactModalContext } from '../context/contactModalContext';

// Lazy-loaded, same reasoning as InquiryModalProvider.
const LazyContactOptionsModal = lazy(() =>
  import('./ContactOptionsModal').then((m) => ({ default: m.ContactOptionsModal })),
);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setShouldLoad(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const preload = useCallback(() => setShouldLoad(true), []);
  const value = useMemo(() => ({ open, close, preload }), [open, close, preload]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {shouldLoad && (
        <Suspense fallback={null}>
          <LazyContactOptionsModal isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </ContactModalContext.Provider>
  );
}
