import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Match, proposalIdsToString, MatchRequest } from './types';

const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, '\n');
const SUGGESTIONS_COLUMN = 'V';

export const getRequests = (matchRequest: MatchRequest, mapRowToRequest: (row: any) => any) =>
  getRows(
    mapRowToRequest,
    CLIENT_EMAIL,
    PRIVATE_KEY,
    matchRequest.requestSpreadsheetId,
    matchRequest.requestSheetId,
    matchRequest.requestIdsToFilter
  );
export const getProposals = (matchRequest: MatchRequest, mapRowToProposal: (row: any) => any) =>
  getRows(
    mapRowToProposal,
    CLIENT_EMAIL,
    PRIVATE_KEY,
    matchRequest.proposalSpreadsheetId,
    matchRequest.proposalSheetId,
    matchRequest.proposalIdsToFilter
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

const getRows = async (
  mapRow: (row: any) => any,
  CLIENT_EMAIL: string,
  PRIVATE_KEY: string,
  SPREADSHEET_ID: string,
  SHEET_ID: string,
  ids: number[] = []
) => {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_ID];
  const rows = await sheet.getRows();
  const filteredRows = ids?.length ? rows.filter((row) => ids.includes(row.rowIndex)) : rows;
  return filteredRows?.map(mapRow);
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

export const getSheetsRetrieveFuncs = {
  getRequests,
  getProposals,
};
