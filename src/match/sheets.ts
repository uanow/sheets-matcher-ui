import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  Request,
  mapRowToRequest,
  Proposal,
  mapRowToProposal,
  Match,
  proposalIdsToString,
  MatchRequest,
} from './types';

const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, '\n');
const SUGGESTIONS_COLUMN = 'V';

export const getRequests = (matchRequest: MatchRequest) =>
  getRows<Request>(
    mapRowToRequest,
    CLIENT_EMAIL,
    PRIVATE_KEY,
    matchRequest.requestSpreadsheetId,
    matchRequest.requestSheetId
  );
export const getProposals = (matchRequest: MatchRequest) =>
  getRows<Proposal>(
    mapRowToProposal,
    CLIENT_EMAIL,
    PRIVATE_KEY,
    matchRequest.proposalSpreadsheetId,
    matchRequest.proposalSheetId
  );
export const saveMatchesToRequestSheet = (matchRequest: MatchRequest, matches: Match[]) =>
  saveMatches(
    SUGGESTIONS_COLUMN,
    matches,
    CLIENT_EMAIL,
    PRIVATE_KEY,
    matchRequest.requestSpreadsheetId,
    matchRequest.requestSheetId
  );

const getRows = async <T>(
  mapRow: (row: any) => T,
  CLIENT_EMAIL: string,
  PRIVATE_KEY: string,
  SPREADSHEET_ID: string,
  SHEET_ID: string
) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_ID];
  const rows = (await sheet.getRows()).map(mapRow);
  return rows;
};

const saveMatches = async (
  column: string,
  matches: Match[],
  CLIENT_EMAIL: string,
  PRIVATE_KEY: string,
  SPREADSHEET_ID: string,
  SHEET_ID: string
) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_ID];
  const maxRowNumber = Math.max(...matches.map((m) => m.requestId));
  await sheet.loadCells(`${column}1:${column}${maxRowNumber}`);
  matches.forEach(
    (match) => (sheet.getCellByA1(`${column}${match.requestId}`).value = proposalIdsToString(match))
  );
  await sheet.saveUpdatedCells();
};
