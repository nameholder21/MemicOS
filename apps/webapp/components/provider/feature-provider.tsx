'use client';

import { NeuronWithPartialRelations } from 'prisma/generated/zod';
import { useMemo, useState } from 'react';
import createContextWrapper from './provider-util';

export const [FeatureContext, useFeatureContext] = createContextWrapper<{
  currentFeature: NeuronWithPartialRelations | undefined;
  setCurrentFeature: (neuron: NeuronWithPartialRelations | undefined) => void;
}>('FeatureContext');

export default function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [currentFeature, setCurrentFeature] = useState<NeuronWithPartialRelations | undefined>();

  return (
    <FeatureContext.Provider
      value={useMemo(
        () => ({
          currentFeature,
          setCurrentFeature,
        }),
        [currentFeature, setCurrentFeature],
      )}
    >
      {children}
    </FeatureContext.Provider>
  );
}
