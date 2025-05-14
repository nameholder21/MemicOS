import { GRAPH_SERVER, GRAPH_SERVER_SECRET, USE_LOCALHOST_GRAPH } from '@/lib/env';
import * as yup from 'yup';

export const GRAPH_MAX_PROMPT_LENGTH_CHARS = 10000;
export const GRAPH_BATCH_SIZE = 48;
// this time estimate comes from testing different prompt lengths with batch size 48, and is only valid for gemma-2-2b
export const getEstimatedTimeFromNumTokens = (numTokens: number) => 0.27 * numTokens ** 1.83 + 8;
export const GRAPH_MAX_TOKENS = 32;
export const GRAPH_GENERATION_ENABLED_MODELS = ['gemma-2-2b'];
export const GRAPH_MODEL_MAP = { 'gemma-2-2b': 'google/gemma-2-2b' };

export const GRAPH_S3_USER_GRAPHS_DIR = 'user-graphs';

export const GRAPH_MAXNLOGITS_MIN = 5;
export const GRAPH_MAXNLOGITS_MAX = 15;
export const GRAPH_MAXNLOGITS_DEFAULT = 10;
export const GRAPH_DESIREDLOGITPROB_MIN = 0.6;
export const GRAPH_DESIREDLOGITPROB_MAX = 0.99;
export const GRAPH_DESIREDLOGITPROB_DEFAULT = 0.95;
export const GRAPH_NODETHRESHOLD_MIN = 0.5;
export const GRAPH_NODETHRESHOLD_MAX = 0.99;
export const GRAPH_NODETHRESHOLD_DEFAULT = 0.8;
export const GRAPH_EDGETHRESHOLD_MIN = 0.8;
export const GRAPH_EDGETHRESHOLD_MAX = 0.99;
export const GRAPH_EDGETHRESHOLD_DEFAULT = 0.98;
export const GRAPH_SLUG_MIN = 2;

export const graphGenerateSchemaClient = yup.object({
  prompt: yup
    .string()
    .max(GRAPH_MAX_PROMPT_LENGTH_CHARS, `Prompt cannot exceed ${GRAPH_MAX_PROMPT_LENGTH_CHARS} characters.`)
    .min(1, 'Prompt is required.')
    .required(),
  modelId: yup.string().min(1, 'Model is required.').oneOf(GRAPH_GENERATION_ENABLED_MODELS).required(),
  maxNLogits: yup
    .number()
    .integer('Must be an integer.')
    .min(GRAPH_MAXNLOGITS_MIN, `Must be at least ${GRAPH_MAXNLOGITS_MIN}.`)
    .max(GRAPH_MAXNLOGITS_MAX, `Must be at most ${GRAPH_MAXNLOGITS_MAX}.`)
    .required('This field is required.'),
  desiredLogitProb: yup
    .number()
    .min(GRAPH_DESIREDLOGITPROB_MIN, `Must be at least ${GRAPH_DESIREDLOGITPROB_MIN}.`)
    .max(GRAPH_DESIREDLOGITPROB_MAX, `Must be at most ${GRAPH_DESIREDLOGITPROB_MAX}.`)
    .required('This field is required.'),
  nodeThreshold: yup
    .number()
    .min(GRAPH_NODETHRESHOLD_MIN, `Must be at least ${GRAPH_NODETHRESHOLD_MIN}.`)
    .max(GRAPH_NODETHRESHOLD_MAX, `Must be at most ${GRAPH_NODETHRESHOLD_MAX}.`)
    .required('This field is required.'),
  edgeThreshold: yup
    .number()
    .min(GRAPH_EDGETHRESHOLD_MIN, `Must be at least ${GRAPH_EDGETHRESHOLD_MIN}.`)
    .max(GRAPH_EDGETHRESHOLD_MAX, `Must be at most ${GRAPH_EDGETHRESHOLD_MAX}.`)
    .required('This field is required.'),
  slug: yup
    .string()
    .min(GRAPH_SLUG_MIN, `Must be at least ${GRAPH_SLUG_MIN} characters.`)
    .matches(/^[a-z0-9_-]+$/, 'Can only contain lowercase alphanumeric characters, underscores, and hyphens.')
    .required('Slug is required.'),
});

export const generateGraph = async (
  prompt: string,
  modelId: string,
  maxNLogits: number,
  desiredLogitProb: number,
  nodeThreshold: number,
  edgeThreshold: number,
  slugIdentifier: string,
) => {
  const response = await fetch(`${USE_LOCALHOST_GRAPH ? 'http://localhost:5004' : GRAPH_SERVER}/generate-graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      'x-secret-key': GRAPH_SERVER_SECRET,
    },
    body: JSON.stringify({
      prompt,
      model_id: GRAPH_MODEL_MAP[modelId as keyof typeof GRAPH_MODEL_MAP],
      batch_size: GRAPH_BATCH_SIZE,
      max_n_logits: maxNLogits,
      desired_logit_prob: desiredLogitProb,
      node_threshold: nodeThreshold,
      edge_threshold: edgeThreshold,
      slug_identifier: slugIdentifier,
    }),
  });

  if (!response.ok) {
    throw new Error(`External API returned ${response.status}: ${response.statusText}`);
  }
  return response.json();
};
