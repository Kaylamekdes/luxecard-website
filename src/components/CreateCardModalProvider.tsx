import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CreateCardModalContext } from '../context/createCardModalContext';
import { CreateCardModal } from './CreateCardModal';

export function CreateCardModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <CreateCardModalContext.Provider value={value}>
      {children}
      <CreateCardModal isOpen={isOpen} onClose={close} />
    </CreateCardModalContext.Provider>
  );
}
