import { ExplanationWithPartialRelations } from '@/prisma/generated/zod';

export class NeuronIdentifier {
  modelId: string;

  layer: string;

  index: string;

  constructor(modelId: string = '', layer: string = '', index: string = '') {
    this.modelId = modelId;
    this.layer = layer;
    this.index = index;
  }

  equals(other: NeuronIdentifier) {
    return this.modelId === other.modelId && this.layer === other.layer && this.index === other.index;
  }

  toString() {
    return `${this.modelId}@${this.layer}:${this.index}`;
  }
}

export function getExplanationNeuronIdentifier(exp: ExplanationWithPartialRelations) {
  return new NeuronIdentifier(exp.modelId, exp.layer, exp.index);
}
