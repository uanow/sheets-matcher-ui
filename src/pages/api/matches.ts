import type { NextApiRequest, NextApiResponse } from 'next';
import { getMatches } from '../../match/match';
import { isValid, Match, MatchRequest } from '../../match/types';

type Data = {
  matches: Match[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const matchRequest = { ...req.body } as MatchRequest;
  if (!isValid(matchRequest)) res.status(404);
  const matches = await getMatches(matchRequest);
  res.status(200).json({ matches });
}

const mapMatchRequest = (matchRequest: MatchRequest): MatchRequest =>
  //isValid(matchRequest) ? matchRequest : DEFAULT_MATCH;
  mergeRequest(matchRequest);

const mergeRequest = (matchRequest: MatchRequest): MatchRequest => ({
  ...matchRequest,
  requestSpreadsheetId: matchRequest.requestSpreadsheetId || DEFAULT_MATCH.requestSpreadsheetId,
  requestSheetId: matchRequest.requestSheetId || DEFAULT_MATCH.requestSheetId,
  proposalSpreadsheetId: matchRequest.proposalSpreadsheetId || DEFAULT_MATCH.proposalSpreadsheetId,
  proposalSheetId: matchRequest.proposalSheetId || DEFAULT_MATCH.proposalSheetId,
});

const PREDEFINED_MATCHES_MAP: { [key: string]: MatchRequest } = {
  'un-refugee': {
    requestSpreadsheetId: process.env.REQUESTS_SPREADSHEET_ID!,
    requestSheetId: process.env.REQUESTS_SHEET_ID!,
    proposalSpreadsheetId: process.env.PROPOSALS_SPREADSHEET_ID!,
    proposalSheetId: process.env.PROPOSALS_SHEET_ID!,
  },
};
const DEFAULT_MATCH = PREDEFINED_MATCHES_MAP['un-refugee'];
