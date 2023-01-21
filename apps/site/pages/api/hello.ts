import { hello } from '@sst2-monorepo/hello';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ hello: hello() });
}
