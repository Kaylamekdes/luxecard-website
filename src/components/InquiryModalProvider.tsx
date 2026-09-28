import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react';
import { InquiryModalContext, type InquiryTab } from '../context/inquiryModalContext';

// Lazy-loaded: this form (plus its KRA/eTIMS validation, pricing lookups
// etc.) doesn't need to be in the bundle that renders the homepage's first
// paint. `preload` below fetches this same chunk ahead of time, so by the
// time `open` is actually called there's normally nothing left to wait on.
const LazyInquiryModal = lazy(() => import('./InquiryModal').then((m) => ({ default: m.InquiryModal })));

export function InquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedTab, setPreselectedTab] = useState<InquiryTab>('individual');
  // Stays false until the modal is first needed — opened, or preloaded — so
  // its chunk isn't fetched before then either.
  const [shouldLoad, setShouldLoad] = useState(false);

  const open = useCallback((tab: InquiryTab) => {
    setPreselectedTab(tab);
    setIsOpen(true);
    setShouldLoad(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const preload = useCallback(() => setShouldLoad(true), []);
  const value = useMemo(() => ({ open, close, preload }), [open, close, preload]);

  return (
    <InquiryModalContext.Provider value={value}>
      {children}
      {shouldLoad && (
        <Suspense fallback={null}>
          <LazyInquiryModal isOpen={isOpen} preselectedTab={preselectedTab} onClose={close} />
        </Suspense>
      )}
    </InquiryModalContext.Provider>
  );
}
