export interface MatchRequest {
  requestSpreadsheetId: string;
  requestSheetId: string;
  proposalSpreadsheetId: string;
  proposalSheetId: string;
  slug?: string;
  propsToBeEqual?: string;
  propsToBeGreater?: string;
  propsToFilter?: string;
  valuesToFilter?: string;
}

export const isValid = (matchRequest: MatchRequest): boolean =>
  matchRequest.requestSpreadsheetId?.length > 0 &&
  matchRequest.requestSheetId?.length > 0 &&
  matchRequest.proposalSpreadsheetId?.length > 0 &&
  matchRequest.proposalSheetId?.length > 0;

export interface Match {
  requestId: number;
  proposalIds: number[];
}

export const proposalIdsToString = (match: Match) => match.proposalIds.join(',');
export const matchesToString = (matches: Match[]) =>
  matches.map((m) => `${m.requestId}: ${proposalIdsToString(m)}`).join('\n');
