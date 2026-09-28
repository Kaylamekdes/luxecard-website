import { createContext, useContext } from 'react';

export type InquiryTab = 'individual' | 'business';

type InquiryModalContextValue = {
  open: (tab: InquiryTab) => void;
  close: () => void;
  // The modal's code is lazy-loaded; calling this starts fetching its chunk
  // ahead of an actual open, so a click that follows has no visible delay.
  // Safe to call repeatedly — a no-op after the first call.
  preload: () => void;
};

export const InquiryModalContext = createContext<InquiryModalContextValue | null>(null);

export function useInquiryModal(): InquiryModalContextValue {
  const ctx = useContext(InquiryModalContext);
  if (!ctx) {
    throw new Error('useInquiryModal must be used within an InquiryModalProvider');
  }
  return ctx;
}
