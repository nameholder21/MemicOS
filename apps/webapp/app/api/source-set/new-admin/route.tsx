import { createSourceSet } from '@/lib/db/source';
import { RequestAuthedAdminUser, withAuthedAdminUser } from '@/lib/with-user';
import { SourceSetSchema } from '@/prisma/generated/zod';
import { Visibility } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = withAuthedAdminUser(async (request: RequestAuthedAdminUser) => {
  const validatedInputSchema = SourceSetSchema.refine((input) => input.visibility === Visibility.PRIVATE, {
    message: 'Invalid input',
  });

  const requestJson = await request.json();
  requestJson.creator = { connect: { id: request.user.id } };

  const validatedInput = validatedInputSchema.parse(requestJson);

  const set = await createSourceSet(validatedInput, request.user);

  return NextResponse.json(set);
});
