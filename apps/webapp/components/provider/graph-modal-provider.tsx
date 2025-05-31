import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

// Define the modal context type
type GraphModalContextType = {
  // Copy modal state
  isCopyModalOpen: boolean;
  setIsCopyModalOpen: (isOpen: boolean) => void;

  // Welcome modal state
  isWelcomeModalOpen: boolean;
  setIsWelcomeModalOpen: (isOpen: boolean) => void;
  welcomeModalInitialStep: number | null;
  openWelcomeModalToStep: (step: number) => void;
  resetWelcomeModalStep: () => void;

  // Generate graph modal state
  isGenerateGraphModalOpen: boolean;
  setIsGenerateGraphModalOpen: (isOpen: boolean) => void;
};

// Create the modal context
const GraphModalContext = createContext<GraphModalContextType | undefined>(undefined);

// GraphModalProvider component
export function GraphModalProvider({ children }: { children: ReactNode }) {
  const [isCopyModalOpen, setIsCopyModalOpenState] = useState<boolean>(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpenState] = useState<boolean>(false);
  const [welcomeModalInitialStep, setWelcomeModalInitialStep] = useState<number | null>(null);
  const [isGenerateGraphModalOpen, setIsGenerateGraphModalOpenState] = useState<boolean>(false);

  // Custom setter for copy modal that closes other modals
  const setIsCopyModalOpen = (isOpen: boolean) => {
    setIsCopyModalOpenState(isOpen);
    if (isOpen) {
      setIsWelcomeModalOpenState(false);
      setIsGenerateGraphModalOpenState(false);
      setWelcomeModalInitialStep(null);
    }
  };

  // Custom setter for welcome modal that closes other modals
  const setIsWelcomeModalOpen = (isOpen: boolean) => {
    setIsWelcomeModalOpenState(isOpen);
    if (isOpen) {
      setIsCopyModalOpenState(false);
      setIsGenerateGraphModalOpenState(false);
    } else {
      setWelcomeModalInitialStep(null);
    }
  };

  // Custom setter for generate graph modal that closes other modals
  const setIsGenerateGraphModalOpen = (isOpen: boolean) => {
    setIsGenerateGraphModalOpenState(isOpen);
    if (isOpen) {
      setIsCopyModalOpenState(false);
      setIsWelcomeModalOpenState(false);
      setWelcomeModalInitialStep(null);
    }
  };

  // Function to open welcome modal to a specific step
  const openWelcomeModalToStep = (step: number) => {
    setWelcomeModalInitialStep(step);
    setIsWelcomeModalOpenState(true);
    // Close other modals
    setIsCopyModalOpenState(false);
    setIsGenerateGraphModalOpenState(false);
  };

  // Function to reset welcome modal initial step
  const resetWelcomeModalStep = () => {
    setWelcomeModalInitialStep(null);
  };

  const contextValue = useMemo(
    () => ({
      isCopyModalOpen,
      setIsCopyModalOpen,
      isWelcomeModalOpen,
      setIsWelcomeModalOpen,
      welcomeModalInitialStep,
      openWelcomeModalToStep,
      resetWelcomeModalStep,
      isGenerateGraphModalOpen,
      setIsGenerateGraphModalOpen,
    }),
    [isCopyModalOpen, isWelcomeModalOpen, welcomeModalInitialStep, isGenerateGraphModalOpen],
  );

  return <GraphModalContext.Provider value={contextValue}>{children}</GraphModalContext.Provider>;
}

// Custom hook to use the modal context
export function useGraphModalContext() {
  const context = useContext(GraphModalContext);
  if (context === undefined) {
    throw new Error('useGraphModalContext must be used within a GraphModalProvider');
  }
  return context;
}
