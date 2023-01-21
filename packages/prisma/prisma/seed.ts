import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  await prisma.doggo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Bobby',
      breed: 'Sea Doggo',
      isGoodBoy: true,
    },
  });

  await prisma.$disconnect();
})();
