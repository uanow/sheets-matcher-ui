import { getProposals, getRequests } from './sheets';
import { locationTranslations } from './translations';
import {
  Match,
  matchesToString,
  Request,
  Proposal,
  MatchRequest,
  mapRowToProposal,
  mapRowToRequest,
} from './types';

export const getMatches = async (matchRequest: MatchRequest): Promise<Match[]> => {
  const { filterRequests, filterProposals, match, mapRowToRequest, mapRowToProposal } =
    getMatchFuncs(matchRequest);

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

  console.log({ proposals, requests, matches: matchesToString(matches) });

  return matches;
};

const matchLocation = (request: Request, proposal: Proposal): boolean => {
  if (
    request.city === proposal.city ||
    locationTranslations[proposal.city]?.includes(request.city) ||
    locationTranslations[request.city]?.includes(proposal.city)
  )
    return true;
  if (
    proposal.country === request.country ||
    locationTranslations[proposal.country]?.includes(request.country) ||
    locationTranslations[request.country]?.includes(proposal.country)
  )
    return true;
  return false;
};

const NO_ANSWERS = ['no', 'ні', 'нема', 'немає', ''];
const matchPets = (request: Request, proposal: Proposal): boolean => {
  if (
    request.pets &&
    !NO_ANSWERS.includes(request.pets) &&
    (!proposal.pets || NO_ANSWERS.includes(proposal.pets))
  )
    return false;
  return true;
};

const match = (request: Request, proposal: Proposal): boolean =>
  matchLocation(request, proposal) &&
  matchPets(request, proposal) &&
  +proposal.seats >= +request.seats;

const filterRequests = (request: Request): boolean =>
  !request.host && ['new', 'Delegated to i1'].includes(request.status);
const filterProposals = (proposal: Proposal): boolean =>
  !proposal.refugee && ['new'].includes(proposal.status);

const genericMatch = (
  request: { [key: string]: string | number },
  proposal: { [key: string]: string | number },
  propsToBeEqual: string[],
  propsToBeGreater: string[]
): boolean =>
  (propsToBeEqual.find((prop) => request[prop] !== proposal[prop]) || //.toString().toLowerCase()
    propsToBeGreater.find((prop) => request[prop] > proposal[prop])) === undefined;

const genericMatchAllPropsEqual = (
  request: { [key: string]: string | number },
  proposal: { [key: string]: string | number },
  propsToIgnore = ['rowNumber']
): boolean =>
  Object.entries(request).find(
    ([key, value]) => !propsToIgnore.includes(key) && proposal[key.toString()] !== value
  ) === undefined;

const genericFilter = (
  request: { [key: string]: string | number },
  propsToFilter: string[],
  valuesToFilter: (string | number)[]
): boolean => propsToFilter.find((prop) => valuesToFilter.includes(request[prop])) === undefined;

const getMatchFuncs = (matchRequest: MatchRequest) => {
  if (matchRequest.slug === 'un-refugee')
    return { match, filterRequests, filterProposals, mapRowToRequest, mapRowToProposal };

  const matchFunc =
    !matchRequest.propsToBeEqual && !matchRequest.propsToBeGreater
      ? genericMatchAllPropsEqual
      : (request: any, proposal: any) =>
          genericMatch(
            request,
            proposal,
            matchRequest.propsToBeEqual?.split(',') ?? Object.keys(request), //[],
            matchRequest.propsToBeGreater?.split(',') ?? []
          );

  const filterFunc =
    !matchRequest.propsToFilter && !matchRequest.valuesToFilter
      ? (request: any) => true
      : (request: any) =>
          genericFilter(
            request,
            matchRequest.propsToFilter?.split(',') ?? [], //['status'],
            matchRequest.valuesToFilter?.split(',') ?? [] //['new']
          );

  // TODO: Brittle.
  const id = (request: any) => {
    const { _sheet, _rowNumber, _rawData, ...props } = request;
    return { ...props, rowNumber: request.rowNumber };
  };

  return {
    match: matchFunc,
    filterRequests: filterFunc,
    filterProposals: filterFunc,
    mapRowToRequest: id,
    mapRowToProposal: id,
  };
};
