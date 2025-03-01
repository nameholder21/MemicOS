import { Activation, ExplanationModelType } from '@prisma/client';
import { AUTOINTERP_SERVER_API } from '../utils/autointerp';

export const generateExplanationEleutherActsTop20 = async (
  activations: Activation[],
  explanationModel: ExplanationModelType,
  explainerKey: string,
) => {
  if (!explanationModel.openRouterModelId) {
    throw new Error('Explaining using np-auto-interp requires an OpenRouter model id.');
  }

  const result = await AUTOINTERP_SERVER_API.explainDefaultPost({
    explainDefaultPostRequest: {
      activations,
      openrouterKey: explainerKey,
      model: explanationModel.openRouterModelId,
    },
  });

  return result.explanation;
};
