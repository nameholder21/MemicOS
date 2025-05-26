import { createModel, getModelById } from '@/lib/db/model';
import { RequestAuthedUser, withAuthedUser } from '@/lib/with-user';
import { Visibility } from '@prisma/client';
import { NextResponse } from 'next/server';

import * as yup from 'yup';

const NewModelRequestSchema = yup.object({
  id: yup
    .string()
    .required()
    .min(2)
    .max(32, 'Model ID must be less than 32 characters')
    .matches(
      /^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/,
      'Name must contain only lowercase letters, digits, and hyphens, start with a letter or digit, not end with a hyphen, and not contain double hyphens',
    )
    .test('no-double-hyphens', 'Name cannot contain double hyphens', (value) => !value || !value.includes('--')),
  layers: yup.number().required().integer().min(1).max(127, 'Layers must be an integer less than 128'),
  displayName: yup.string().optional().min(1).max(64, 'Display name must be less than 64 characters'),
  url: yup.string().optional().nullable().url('Must be a valid URL'),
});

export const POST = withAuthedUser(async (request: RequestAuthedUser) => {
  const requestJson = await request.json();

  let validatedRequest;
  try {
    validatedRequest = await NewModelRequestSchema.validate(requestJson);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ error: error.message, path: error.path }, { status: 400 });
    }
    throw error;
  }

  // check if model already exists
  const existingModel = await getModelById(validatedRequest.id);
  if (existingModel) {
    return NextResponse.json({ error: 'Model already exists' }, { status: 400 });
  }

  const model = {
    id: validatedRequest.id,
    creatorId: request.user.id,
    layers: validatedRequest.layers,
    displayName: validatedRequest.displayName ?? validatedRequest.id,
    displayNameShort: validatedRequest.displayName ?? validatedRequest.id,
    website: validatedRequest.url ?? null,
    visibility: Visibility.UNLISTED,
    instruct: false,
    tlensId: null,
    inferenceEnabled: false,
    dimension: null,
    defaultSourceId: null,
    defaultSourceSetName: null,
    thinking: false,

    neuronsPerLayer: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: 'custom',
  };

  const newModel = await createModel(model, request.user);

  return NextResponse.json(newModel);
});
