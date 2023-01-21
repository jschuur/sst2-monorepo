import { PrismaClient } from '@sst2-monorepo/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const doggos = await prisma.doggo.findMany();

  res.status(200).json({ doggos });
}
