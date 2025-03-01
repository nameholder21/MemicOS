import { prisma } from '@/lib/db';
import { ExplanationScoreTypeWithPartialRelations, ExplanationTypeWithPartialRelations } from '@/prisma/generated/zod';

export const getExplanationType = async (name: string) => {
  const type = (await prisma.explanationType.findUnique({
    where: {
      name,
    },
  })) as ExplanationTypeWithPartialRelations;
  if (type) {
    const explanations = await prisma.explanation.findMany({
      where: { typeName: name },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    type.explanations = explanations;
    const neurons = await prisma.neuron.findMany({
      where: {
        OR: type.explanations.map((e) => ({
          modelId: e.modelId,
          layer: e.layer,
          index: e.index,
        })),
      },
      include: { activations: { take: 1, orderBy: { maxValue: 'desc' } } },
    });
    type.explanations = type.explanations.map((e) => ({
      ...e,
      neuron: neurons.find((n) => n.modelId === e.modelId && n.layer === e.layer && n.index === e.index),
    }));
  }
  return type;
};

export const getExplanationTypes = async () =>
  prisma.explanationType.findMany({
    where: {
      name: {
        not: 'human',
      },
      featured: true,
    },
    orderBy: { displayName: 'asc' },
  });

export const getExplanationModels = async () =>
  prisma.explanationModelType.findMany({
    where: {
      featured: true,
    },
    orderBy: { displayName: 'asc' },
  });

export const getExplanationScoreType = async (name: string) => {
  const type = (await prisma.explanationScoreType.findUnique({
    where: {
      name,
    },
  })) as ExplanationScoreTypeWithPartialRelations;
  const scores = await prisma.explanationScore.findMany({
    where: { explanationScoreTypeName: name },
    take: 20,
    include: {
      explanation: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  type.explanationScores = scores;
  return type;
};

export const getExplanationScoreTypes = async () =>
  prisma.explanationScoreType.findMany({
    orderBy: { displayName: 'asc' },
  });

export const getExplanationScoreModelTypes = async () =>
  prisma.explanationScoreModel.findMany({
    orderBy: { displayName: 'asc' },
  });
