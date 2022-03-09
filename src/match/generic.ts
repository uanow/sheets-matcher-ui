import { MatchRequest } from './types';

const DEFAULT_PROPS_TO_IGNORE = ['rowNumber'];

const haveCommonWords = (request: string, proposal: string): boolean => {
  // TODO: Use single regex, figure out unicode matching
  const requestWords = request.match(/\p{Letter}+/gu);
  const proposalWords = proposal.match(/\p{Letter}+/gu);
  if (!requestWords || !proposalWords || requestWords.length === 0 || proposalWords.length == 0)
    return false;

  const lowerCaseProposalWords = proposalWords.map((p) => p.toLowerCase());
  return !!requestWords.find((r) => lowerCaseProposalWords.includes(r.toLowerCase()));

  // var captures = /\b(\w+)\b.*;.*\b\1\b/i.exec(`${request}&${proposal}`);
  // return !!captures && !!captures[1];
};

const genericMatch = (
  request: { [key: string]: string | number },
  proposal: { [key: string]: string | number },
  propsToHaveCommonWords: string[],
  propsToBeEqual: string[],
  propsToBeGreater: string[],
  propsToIgnore = DEFAULT_PROPS_TO_IGNORE
): boolean =>
  (propsToBeEqual
    .filter((prop) => !propsToIgnore.includes(prop) && !propsToBeGreater.includes(prop))
    .find((prop) => request[prop] !== proposal[prop]) || //.toString().toLowerCase()
    propsToHaveCommonWords
      .filter(
        (prop) =>
          !propsToIgnore.includes(prop) &&
          !propsToBeGreater.includes(prop) &&
          !propsToBeEqual.includes(prop)
      )
      .find((prop) => !haveCommonWords(request[prop].toString(), proposal[prop].toString())) ||
    propsToBeGreater
      .filter((prop) => !propsToIgnore.includes(prop))
      .find(
        (prop) =>
          +request[prop] > +proposal[prop] && !isNaN(+request[prop]) && !isNaN(+proposal[prop])
      )) === undefined;

const genericMatchAllPropsEqual = (
  request: { [key: string]: string | number },
  proposal: { [key: string]: string | number },
  propsToIgnore = DEFAULT_PROPS_TO_IGNORE
): boolean =>
  Object.entries(request).find(
    ([key, value]) => !propsToIgnore.includes(key) && proposal[key.toString()] !== value
  ) === undefined;

const genericFilter = (
  request: { [key: string]: string | number },
  propsToFilter: string[],
  valuesToFilter: (string | number)[][]
): boolean =>
  propsToFilter.find((prop, index) => !valuesToFilter[index].includes(request[prop])) === undefined;

const getGenericMatchFuncs = (matchRequest: MatchRequest) => {
  const propsToIgnore = [
    ...DEFAULT_PROPS_TO_IGNORE,
    ...(matchRequest.propsToIgnore?.split(',').filter(Boolean) ?? []),
  ];
  const matchFunc =
    !matchRequest.propsToBeEqual && !matchRequest.propsToBeGreater
      ? (request: any, proposal: any) => genericMatchAllPropsEqual(request, proposal, propsToIgnore)
      : (request: any, proposal: any) =>
          genericMatch(
            request,
            proposal,
            matchRequest.propsToHaveCommonWords?.split(',').filter(Boolean) ?? [],
            !matchRequest.propsToBeEqual
              ? Object.keys(request)
              : matchRequest.propsToBeEqual?.split(',').filter(Boolean),
            matchRequest.propsToBeGreater?.split(',').filter(Boolean) ?? [],
            propsToIgnore
          );

  const filterFunc =
    !matchRequest.propsToFilter && !matchRequest.valuesToFilter
      ? (request: any) => true
      : (request: any) =>
          genericFilter(
            request,
            matchRequest.propsToFilter?.split(',') ?? [], //['status'],
            matchRequest.valuesToFilter?.split(';')?.map((v) => v?.split(',')) ?? [[]] //['new']
          );

  // TODO: Brittle.
  const id = (request: any) => {
    const { _sheet, _rowNumber, _rawData, _rawJson, _table, ...props } = request;
    return props.fields && _rawJson // Brittle, airtable detection.
      ? { ...props.fields, rowNumber: request.rowNumber ?? request.id }
      : { ...props, rowNumber: request.rowNumber ?? request.id };
  };

  return {
    match: matchFunc,
    filterRequests: filterFunc,
    filterProposals: filterFunc,
    mapRowToRequest: id,
    mapRowToProposal: id,
  };
};

export default getGenericMatchFuncs;
