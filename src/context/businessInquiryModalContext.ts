import { createContext, useContext } from 'react';

type BusinessInquiryModalContextValue = {
  open: () => void;
  close: () => void;
};

export const BusinessInquiryModalContext = createContext<BusinessInquiryModalContextValue | null>(null);

export function useBusinessInquiryModal(): BusinessInquiryModalContextValue {
  const ctx = useContext(BusinessInquiryModalContext);
  if (!ctx) {
    throw new Error('useBusinessInquiryModal must be used within a BusinessInquiryModalProvider');
  }
  return ctx;
}
