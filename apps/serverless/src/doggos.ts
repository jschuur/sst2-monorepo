import { PrismaClient } from '@sst2-monorepo/prisma';
import { ApiHandler } from 'sst/node/api';

const prisma = new PrismaClient();

export const handler = ApiHandler(async (_evt) => {
  const doggos = await prisma.doggo.findMany();

  return {
    body: JSON.stringify({ doggos }, null, 2),
  };
});
