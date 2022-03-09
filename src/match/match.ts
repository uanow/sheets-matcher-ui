import { getAirtableRetrieveFuncs } from './airtable';
import getGenericMatchFuncs from './generic';
import getRefugeeMatchFuncs from './refugee';
import { getSheetsRetrieveFuncs } from './sheets';
import { Match, matchesToString, MatchRequest } from './types';

export const getMatches = async (matchRequest: MatchRequest): Promise<Match[]> => {
  const { filterRequests, filterProposals, match, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

  const { getRequests, getProposals } = getRetrieveFuncs(matchRequest);

  const requests = (await getRequests(matchRequest, mapRowToRequest)).filter(filterRequests);
  const proposals = (await getProposals(matchRequest, mapRowToProposal)).filter(filterProposals);

  const matches: Match[] = requests
    .map((request) => ({
      requestId: request.rowNumber,
      proposalIds: proposals
        .filter((proposal) => match(request, proposal))
        .map((proposal) => proposal.rowNumber),
    }))
    .filter((match) => match.proposalIds.length > 0);

  // console.log({ proposals, requests, matches: matchesToString(matches) });

  return matches;
};

export const getMatchFuncs = (matchRequest: MatchRequest) =>
  matchRequest.matchType === 'un-refugee'
    ? getRefugeeMatchFuncs
    : getGenericMatchFuncs(matchRequest);

export const getRetrieveFuncs = (matchRequest: MatchRequest) =>
  matchRequest.sourceType === 'airtable' ? getAirtableRetrieveFuncs : getSheetsRetrieveFuncs;
