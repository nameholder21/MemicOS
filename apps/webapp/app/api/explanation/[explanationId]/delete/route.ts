import { deleteExplanationById } from '@/lib/db/explanation';
import { RequestAuthedUser, withAuthedUser } from '@/lib/with-user';
import { NextResponse } from 'next/server';

export const POST = withAuthedUser(
  async (
    request: RequestAuthedUser,
    {
      params,
    }: {
      params: { explanationId: string };
    },
  ) => {
    await deleteExplanationById(params.explanationId, request.user);

    return NextResponse.json({ message: 'Explanation deleted' });
  },
);
