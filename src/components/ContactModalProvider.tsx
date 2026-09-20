import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ContactModalContext } from '../context/contactModalContext';
import { ContactOptionsModal } from './ContactOptionsModal';

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactOptionsModal isOpen={isOpen} onClose={close} />
    </ContactModalContext.Provider>
  );
}
