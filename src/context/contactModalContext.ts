import { createContext, useContext } from 'react';

type ContactModalContextValue = {
  open: () => void;
  close: () => void;
  // Same idea as InquiryModalContext's preload: starts fetching the modal's
  // lazy-loaded chunk ahead of an open. Safe to call repeatedly.
  preload: () => void;
};

export const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function useContactModal(): ContactModalContextValue {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return ctx;
}
