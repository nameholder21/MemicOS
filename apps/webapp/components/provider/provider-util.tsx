import { createContext, useContext } from 'react';

export default function createContextWrapper<ContextType>(contextName: string) {
  const Context = createContext<ContextType | null>(null);
  Context.displayName = contextName;

  function useContextWrapper() {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`${Context.displayName ?? 'Context'} must be used within its provider`);
    }
    return context;
  }

  return [Context, useContextWrapper] as const;
}
