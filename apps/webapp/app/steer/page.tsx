import { DEFAULT_STEER_MODEL } from '@/lib/env';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Page() {
  if (!DEFAULT_STEER_MODEL) {
    const model = await prisma.model.findFirst({
      where: {
        visibility: 'PUBLIC',
      },
    });
    redirect(`/${model?.id}/steer`);
  }
  redirect(`/${DEFAULT_STEER_MODEL}/steer`);
}
