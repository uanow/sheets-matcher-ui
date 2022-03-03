import { getMatchFuncs } from './match';
import { getProposals, getRequests } from './sheets';
import { MatchRequest } from './types';

export const sendDetailsToChat = async (matchRequest: MatchRequest): Promise<number> => {
  const { filterRequests, filterProposals, match, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

  const requests = (await getRequests(matchRequest, mapRowToRequest)).filter(filterRequests);
  const proposals = (await getProposals(matchRequest, mapRowToProposal)).filter(filterProposals);

  const message = requests
    .flatMap((request) => proposals.map((proposal) => matchToConnectString(request, proposal)))
    .filter(Boolean)
    .join('%0A%0A');

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&text=${message}`
  );

  return response.status;
};

const matchToConnectString = (request: any, proposal: any) =>
  `Request №${request.rowNumber} by @${request.telegram} <-> Proposal №${proposal.rowNumber} by @${proposal.telegram}.`;
