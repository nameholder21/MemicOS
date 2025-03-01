import { List } from '@prisma/client';

export type ListNeuronToAdd = {
  modelId: string;
  layer: string;
  index: string;
  description: string;
};
export const MAX_LIST_FEATURES_FOR_TEST_TEXT = 20;
export const MAX_LIST_TEST_TEXT_LENGTH_CHARS = 500;
export type ListWithPartialRelationsAndUrl = List & {
  url: string;
};
