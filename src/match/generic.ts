import { MatchRequest } from './types';

const genericMatch = (
  request: { [key: string]: string | number },
  proposal: { [key: string]: string | number },
  propsToBeEqual: string[],
  propsToBeGreater: string[],
  propsToIgnore = ['rowNumber']
): boolean =>
  (propsToBeEqual
    .filter((prop) => !propsToIgnore.includes(prop) && !propsToBeGreater.includes(prop))
    .find((prop) => request[prop] !== proposal[prop]) || //.toString().toLowerCase()
    propsToBeGreater
      .filter((prop) => !propsToIgnore.includes(prop))
      .find(
        (prop) =>
          +request[prop] > +proposal[prop] && !isNaN(+request[prop]) && !isNaN(+proposal[prop])
      )) === undefined;

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

const getGenericMatchFuncs = (matchRequest: MatchRequest) => {
  const matchFunc =
    !matchRequest.propsToBeEqual && !matchRequest.propsToBeGreater
      ? genericMatchAllPropsEqual
      : (request: any, proposal: any) =>
          genericMatch(
            request,
            proposal,
            !matchRequest.propsToBeEqual
              ? Object.keys(request)
              : matchRequest.propsToBeEqual?.split(',').filter(Boolean),
            matchRequest.propsToBeGreater?.split(',').filter(Boolean) ?? []
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

export default getGenericMatchFuncs;
