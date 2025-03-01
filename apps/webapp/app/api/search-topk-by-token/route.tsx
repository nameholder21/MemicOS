import { getNeuronsForTopkSearcherExplanationOnly } from '@/lib/db/neuron';
import { assertUserCanAccessModelAndSource } from '@/lib/db/userCanAccess';
import { getActivationsTopKByToken, SearchTopKResult } from '@/lib/utils/inference';
import { RequestOptionalUser, withOptionalUser } from '@/lib/with-user';
import { ActivationTopkByTokenPost200Response } from 'memicos-inference-client';
import { NextResponse } from 'next/server';
import { boolean, number, object, string, ValidationError } from 'yup';

export const maxDuration = 30;

const SEARCHER_TOPK_MAX_CHAR_LENGTH = 250;
const NUMBER_TOPK_RESULTS = 10;
const DEFAULT_DENSITY_THRESHOLD = 0.01;

const searchWithTopKRequestSchema = object({
  modelId: string().required().max(50),
  layer: string().required().max(50),
  text: string().required().max(SEARCHER_TOPK_MAX_CHAR_LENGTH),
  numResults: number().optional().min(1).max(20).default(NUMBER_TOPK_RESULTS),
  ignoreBos: boolean().optional().default(true),
  densityThreshold: number().optional().default(DEFAULT_DENSITY_THRESHOLD),
  save: boolean().optional().default(false),
});

export const POST = withOptionalUser(async (request: RequestOptionalUser) => {
  try {
    const body = await searchWithTopKRequestSchema.validate(await request.json());

    const { modelId, layer, text, numResults, ignoreBos } = body;

    const densityThreshold = body.densityThreshold || -1;
    if (densityThreshold !== -1 && (densityThreshold <= 0 || densityThreshold >= 1)) {
      throw new Error('densityThreshold must be between 0 and 1.');
    }

    await assertUserCanAccessModelAndSource(modelId, layer, request.user);

    const result: ActivationTopkByTokenPost200Response = await getActivationsTopKByToken(
      modelId,
      layer,
      text,
      numResults,
      ignoreBos,
      request.user,
    );

    const neuronData = await getNeuronsForTopkSearcherExplanationOnly(modelId, layer, result, request.user);

    // make a toReturn object
    const toReturn: SearchTopKResult = {
      source: layer,
      results: result.results.map((r) => ({
        position: r.tokenPosition,
        token: r.token,
        topFeatures: r.topFeatures.map((f) => ({
          activationValue: f.activationValue,
          featureIndex: f.featureIndex,
          feature: neuronData.find((n) => n.index === f.featureIndex.toString()),
        })),
      })),
    };

    // remove all that are below the density threshold
    if (densityThreshold !== -1) {
      toReturn.results = toReturn.results.map((r) => {
        // eslint-disable-next-line no-param-reassign
        r.topFeatures = r.topFeatures.filter(
          (f) => f.feature?.frac_nonzero && f.feature?.frac_nonzero <= densityThreshold,
        );
        return r;
      });
    }

    return NextResponse.json(toReturn);
  } catch (error) {
    console.error('error', error);
    if (error instanceof ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Unknown Error' }, { status: 500 });
  }
});
