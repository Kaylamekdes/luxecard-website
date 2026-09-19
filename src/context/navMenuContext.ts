import { createContext, useContext } from 'react';

type NavMenuContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

export const NavMenuContext = createContext<NavMenuContextValue | null>(null);

export function useNavMenu(): NavMenuContextValue {
  const ctx = useContext(NavMenuContext);
  if (!ctx) {
    throw new Error('useNavMenu must be used within a NavMenuProvider');
  }
  return ctx;
}
