import { getMatches } from './match';
import { saveMatchesToRequestSheet } from './sheets';
import { Match, matchesToString } from './types';

const match = async (rewrite = false): Promise<string> => {
  const matches: Match[] = await getMatches();
  if (rewrite) await saveMatchesToRequestSheet(matches);
  return matches.length
    ? `request: proposals\n\n${matchesToString(matches)}`
    : 'No matches found yet.';
};

export default match;
