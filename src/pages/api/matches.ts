import type { NextApiRequest, NextApiResponse } from 'next';
import { getMatches } from '../../match/match';
import { Match } from '../../match/types';

type Data = {
  matches: Match[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const matches = await getMatches();
  res.status(200).json({ matches });
}
