import { createContext, useContext } from 'react';

type CreateCardModalContextValue = {
  open: () => void;
  close: () => void;
};

export const CreateCardModalContext = createContext<CreateCardModalContextValue | null>(null);

export function useCreateCardModal(): CreateCardModalContextValue {
  const ctx = useContext(CreateCardModalContext);
  if (!ctx) {
    throw new Error('useCreateCardModal must be used within a CreateCardModalProvider');
  }
  return ctx;
}
