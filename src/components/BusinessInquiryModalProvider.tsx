import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { BusinessInquiryModalContext } from '../context/businessInquiryModalContext';
import { BusinessInquiryModal } from './BusinessInquiryModal';

export function BusinessInquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BusinessInquiryModalContext.Provider value={value}>
      {children}
      <BusinessInquiryModal isOpen={isOpen} onClose={close} />
    </BusinessInquiryModalContext.Provider>
  );
}
