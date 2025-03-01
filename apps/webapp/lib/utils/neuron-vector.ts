import { NeuronPartial } from '@/prisma/generated/zod';

export const MEMICOS_SOURCE_SET_ID = '-memicos';

export const VECTOR_VALID_HOOK_TYPE_TO_DETAILS: Record<string, { displayName: string; sourceSetSuffix: string }> = {
  hook_resid_pre: {
    displayName: 'Residual Stream Pre',
    sourceSetSuffix: 'resid-pre',
  },
};

// for not in own source, we don't want to show the feature selector at the top or the breadcrumbs
export function shouldHideBreadcrumbsAndSelectorForNeuronVector(neuron: NeuronPartial | undefined) {
  return neuron?.layer?.includes(MEMICOS_SOURCE_SET_ID);
}

// for features that have vector in the database, show the extra feature panel
export function neuronHasVectorInDatabase(neuron: NeuronPartial | undefined) {
  return neuron?.vector && neuron.vector.length > 0;
}
