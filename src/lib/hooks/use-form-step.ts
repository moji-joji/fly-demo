'use client';

import { createContext, useContext } from 'react';

interface ContextProps {
  stepsReached: number;
  onContinue: (currStep: number) => void;
  onBack?: () => void;
  maxSteps: number;
}

const StepContext = createContext<ContextProps>({
  stepsReached: 1,
  onContinue: () => {
    throw new Error('StepContext not provided on continue');
  },
  onBack: () => {
    throw new Error('StepContext not provided on return');
  },
  maxSteps: 8,
});

const useFormStep = () => {
  const formStep = useContext(StepContext);
  if (!formStep) {
    throw new Error('useFormStep must be used within a StepContext');
  }
  return formStep;
};

export { StepContext, useFormStep };
