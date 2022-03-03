import { getMatches } from './match';
import { saveMatchesToRequestSheet } from './sheets';
import { Match, matchesToString, MatchRequest } from './types';

const match = async (matchRequest: MatchRequest, rewrite = false): Promise<string> => {
  const matches: Match[] = await getMatches(matchRequest);
  if (rewrite) await saveMatchesToRequestSheet(matchRequest, matches);
  return matches.length
    ? `request: proposals\n\n${matchesToString(matches)}`
    : 'No matches found yet.';
};

export default match;
