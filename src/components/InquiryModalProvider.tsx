import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { InquiryModalContext, type InquiryTab } from '../context/inquiryModalContext';
import { InquiryModal } from './InquiryModal';

export function InquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedTab, setPreselectedTab] = useState<InquiryTab>('individual');

  const open = useCallback((tab: InquiryTab) => {
    setPreselectedTab(tab);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <InquiryModalContext.Provider value={value}>
      {children}
      <InquiryModal isOpen={isOpen} preselectedTab={preselectedTab} onClose={close} />
    </InquiryModalContext.Provider>
  );
}
