import type { NextApiRequest, NextApiResponse } from 'next';
import { sendDetailsToChat } from '../../match/details';
import { isValid, MatchRequest } from '../../match/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const matchRequest = { ...req.body } as MatchRequest;
  if (!isValid(matchRequest)) res.status(404);
  const status = await sendDetailsToChat(matchRequest);
  res.status(status).end();
}
