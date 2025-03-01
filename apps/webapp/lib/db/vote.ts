import { prisma } from '@/lib/db';

export const vote = (voterId: string, explanationId: string) =>
  prisma.vote
    .findUnique({
      where: {
        voter_explanation_index: {
          voterId,
          explanationId,
        },
      },
    })
    .then((existingVote) => {
      if (existingVote) {
        // user already voted for this, so just return the vote
        return existingVote;
      }
      // vote doesn't exist, create it
      return prisma.vote.create({
        data: {
          voterId,
          explanationId,
        },
      });
    });

export const unvote = (voterId: string, explanationId: string) =>
  prisma.vote
    .findUniqueOrThrow({
      where: {
        voter_explanation_index: {
          voterId,
          explanationId,
        },
      },
    })
    .then(() =>
      prisma.vote.delete({
        where: {
          voter_explanation_index: {
            voterId,
            explanationId,
          },
        },
      }),
    );
