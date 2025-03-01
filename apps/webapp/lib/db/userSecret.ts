import { prisma } from '@/lib/db';
import { UserSecretType } from '@prisma/client';
import { ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY } from '../env';
import { AuthenticatedUser } from '../with-user';
import { getUserByName } from './user';

export const getUserSecret = async (username: string, type: UserSecretType) =>
  prisma.userSecret.findUnique({
    where: {
      username_type: {
        username,
        type,
      },
    },
  });

export const updateUserSecret = async (username: string, type: UserSecretType, value: string) =>
  prisma.userSecret.upsert({
    where: {
      username_type: {
        username,
        type,
      },
    },
    update: {
      value,
    },
    create: {
      username,
      type,
      value,
    },
  });

export const removeUserSecret = async (username: string, type: UserSecretType) => {
  if (type === UserSecretType.MEMICOS) {
    throw new Error('Cannot remove memicos secret');
  }
  return prisma.userSecret.delete({
    where: {
      username_type: {
        username,
        type,
      },
    },
  });
};

export const getAutoInterpKeyToUse = async (type: UserSecretType, user: AuthenticatedUser) => {
  // get user, if it's admin, use the stored secret
  const authedUser = await getUserByName(user.name);
  if (authedUser.canTriggerExplanations) {
    if (type === UserSecretType.OPENAI) {
      return OPENAI_API_KEY;
    }
    if (type === UserSecretType.GOOGLE) {
      return GEMINI_API_KEY;
    }
    if (type === UserSecretType.ANTHROPIC) {
      return ANTHROPIC_API_KEY;
    }
    return OPENROUTER_API_KEY;
  }
  const secret = await getUserSecret(user.name, type);
  return secret?.value;
};
