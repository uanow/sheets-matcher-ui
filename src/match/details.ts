import { getMatchFuncs } from './match';
import { getProposals, getRequests } from './sheets';
import { MatchRequest } from './types';

export const sendDetailsToChat = async (matchRequest: MatchRequest): Promise<number> => {
  const { filterRequests, filterProposals, match, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

  const requests = (await getRequests(matchRequest, mapRowToRequest)).filter(filterRequests);
  const proposals = (await getProposals(matchRequest, mapRowToProposal)).filter(filterProposals);

  const message = requests
    .map((request) => proposals.map((proposal) => matchToConnectString(request, proposal)))
    .filter(Boolean)
    .join('\n\n');

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${message}`
  );

  return response.status;
};

const matchToConnectString = (request: any, proposal: any) =>
  `Connect request №${request.rowNumber} by @${request.telegram} with proposal №${proposal.rowNumber} by @${proposal.telegram}`;
