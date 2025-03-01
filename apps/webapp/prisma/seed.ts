import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function main() {
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`;

  // Configure HNSW vector search parameters
  try {
    await prisma.$executeRaw`ALTER DATABASE postgres SET hnsw.iterative_scan = relaxed_order`;
    await prisma.$executeRaw`ALTER DATABASE postgres SET hnsw.ef_search = 250`;
  } catch (error) {
    // ok if it fails
    console.error(error);
  }

  // ============= USERS =============
  // Nonuser account that is the default creator of models, sources, activations, etc when uploaded.
  const admin = await prisma.user.upsert({
    where: { id: 'clkht01d40000jv08hvalcvly' },
    update: {},
    create: {
      name: 'bot',
      id: 'clkht01d40000jv08hvalcvly',
      bot: true,
      admin: true,
      emailUnsubscribeCode: generateRandomString(32),
      emailNewsletterNotification: false,
      emailUnsubscribeAll: true,
    },
  });

  // Nonuser account that is the userId for inference search activations that are created by anonymous users.
  const privateSearchUser = await prisma.user.upsert({
    where: { id: 'cljgamm90000076zdchicy6zj' },
    update: {},
    create: {
      name: 'inferenceactivation',
      id: 'cljgamm90000076zdchicy6zj',
      bot: true,
      admin: false,
      emailUnsubscribeCode: generateRandomString(32),
      emailNewsletterNotification: false,
    },
  });

  console.log({ admin, privateSearchUser });
}

main()
  .then(async () => {
    console.log('Seeding complete');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
