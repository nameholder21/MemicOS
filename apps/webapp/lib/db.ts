import { NODE_ENV } from '@/lib/env';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
