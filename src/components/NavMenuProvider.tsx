import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { NavMenuContext } from '../context/navMenuContext';

export function NavMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  return <NavMenuContext.Provider value={value}>{children}</NavMenuContext.Provider>;
}
