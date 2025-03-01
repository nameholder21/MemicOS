import { NODE_ENV } from '@/lib/env';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (NODE_ENV === 'development') {
  // Need to cast since extended PrismaClient has different type
  global.prisma = prisma as PrismaClient;
}

export default prisma;
