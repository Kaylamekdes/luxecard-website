import { createContext, useContext } from 'react';

export type InquiryTab = 'individual' | 'business';

type InquiryModalContextValue = {
  open: (tab: InquiryTab) => void;
  close: () => void;
};

export const InquiryModalContext = createContext<InquiryModalContextValue | null>(null);

export function useInquiryModal(): InquiryModalContextValue {
  const ctx = useContext(InquiryModalContext);
  if (!ctx) {
    throw new Error('useInquiryModal must be used within an InquiryModalProvider');
  }
  return ctx;
}
