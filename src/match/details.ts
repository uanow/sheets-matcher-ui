import { getMatchFuncs } from './match';
import { getProposals, getRequests } from './sheets';
import { MatchRequest } from './types';

export const sendDetailsToChat = async (matchRequest: MatchRequest): Promise<number> => {
  const { filterRequests, filterProposals, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

  const requests = (await getRequests(matchRequest, mapRowToRequest)).filter(filterRequests);
  const proposals = (await getProposals(matchRequest, mapRowToProposal)).filter(filterProposals);

  const message = requests
    .flatMap((request) =>
      proposals.map((proposal) => matchToConnectString(request, proposal, matchRequest))
    )
    .filter(Boolean)
    .join('%0A%0A');

  const chatId = !!matchRequest.chatId ? matchRequest.chatId : process.env.CHAT_ID;

  console.log({ message, chatId, token: process.env.BOT_TOKEN?.[0] });

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${message}`
  );

  console.log({ response });

  return response.status;
};

const matchToConnectString = (request: any, proposal: any, matchRequest: MatchRequest) => {
  // TODO: Potentially exposes columns hidden from operators, needs implementing chats approval.
  const columnsSendToChat = matchRequest.columnsSendToChat?.split(',').filter(Boolean) ?? [
    'telegram',
  ];
  const details = columnsSendToChat.map((c) => `${request[c]} <-> ${proposal[c]}`).join('%0A');
  // console.log({ columnsSendToChat, details, request, proposal });
  return `Request №${request.rowNumber} <-> Proposal №${proposal.rowNumber}%0A${details}`;
};
