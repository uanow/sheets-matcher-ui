import type { NextApiRequest, NextApiResponse } from 'next';
import { isValid, MatchRequest } from '../../match/types';
import { saveMatchRequest } from '../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const matchRequest = { ...req.body } as MatchRequest;
  console.log({ matchRequest });
  if (!isValid(matchRequest)) res.status(404);
  const { error } = await saveMatchRequest(matchRequest);
  res.status(error ? 500 : 200).end();
}
