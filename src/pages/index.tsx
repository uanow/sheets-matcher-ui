import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isValid, Match, MatchRequest } from '../match/types';
import styles from '../styles/Home.module.css';

const Match = ({
  match,
  request,
  showConnect,
}: {
  match: Match;
  request: MatchRequest;
  showConnect: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const requestWithMatch: MatchRequest = {
    ...request,
    requestIdsToFilter: [match.requestId],
    proposalIdsToFilter: match.proposalIds,
  };
  const handleConnect = async () => {
    setIsLoading(true);
    await fetch('/api/connect', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify(requestWithMatch),
    });
    setIsLoading(false);
  };
  return (
    <tr key={match.requestId}>
      <td>{match.requestId}</td>
      <td>{match.proposalIds.join(', ')}</td>
      {showConnect && (
        <td>
          <button disabled={isLoading} onClick={handleConnect}>
            {isLoading ? 'Connecting..' : 'Connect'}
          </button>
        </td>
      )}
    </tr>
  );
};

const Room: NextPage = () => {
  const router = useRouter();
  const { config: showConfig = false, connect: showConnect = false } = router.query || {};
  const [error, setError] = useState('');

  const [propsToBeEqual, setPropsToBeEqual] = useState('');
  const [propsToBeGreater, setPropsToBeGreater] = useState('');
  // TODO: Consider mark columns in spreadhseet, so they are ignored (color/note etc). So all setup could be made there.
  const [propsToIgnore, setPropsToIgnore] = useState('contact,phone,telegram,facebook');
  const [propsToFilter, setPropsToFilter] = useState('');
  const [valuesToFilter, setValuesToFilter] = useState('');

  const [slug, setSlug] = useState('generic');
  const [requestSpreadsheetId, setRequestSpreadsheetId] = useState('');
  const [requestSheetId, setRequestSheetId] = useState('');
  const [proposalSpreadsheetId, setProposalSpreadsheetId] = useState('');
  const [proposalSheetId, setProposalSheetId] = useState('');
  const [matchRequest, setMatchRequest] = useState<MatchRequest>({
    requestSpreadsheetId,
    requestSheetId,
    proposalSpreadsheetId,
    proposalSheetId,
    propsToBeEqual,
    propsToBeGreater,
    propsToIgnore,
    propsToFilter,
    valuesToFilter,
  });
  useEffect(() => {
    setMatchRequest({
      requestSpreadsheetId,
      requestSheetId,
      proposalSpreadsheetId,
      proposalSheetId,
      slug,
      propsToBeEqual,
      propsToBeGreater,
      propsToIgnore,
      propsToFilter,
      valuesToFilter,
    });
  }, [
    requestSpreadsheetId,
    requestSheetId,
    proposalSpreadsheetId,
    proposalSheetId,
    slug,
    propsToBeEqual,
    propsToBeGreater,
    propsToIgnore,
    propsToFilter,
    valuesToFilter,
  ]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchMacthes = async () => {
    if (!isValid(matchRequest)) return;

    try {
      setError('');
      setIsLoading(true);
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(matchRequest),
      });
      const json = await response.json();
      setMatches(json.matches);
      setIsLoading(false);
    } catch (error) {
      setError('Please, check spreadhseet id and name.');
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMacthes();
  }, []);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Matches</h1>
      <div className="flex flex-col justify-center items-center w-2/4">
        <input
          className="w-full text-md text-center items-center mb-2 mt-2"
          type="text"
          placeholder="Requests spreadsheet id: 1fgmYoJMn6282jzdfjsHsdsd788UYc_xUITy6hIL6"
          value={requestSpreadsheetId}
          onChange={(e) => setRequestSpreadsheetId(e.target.value)}
        />
        <input
          className="w-full text-md text-center items-center mb-2"
          type="text"
          placeholder="Requests sheet name: Sheet1"
          value={requestSheetId}
          onChange={(e) => setRequestSheetId(e.target.value)}
        />
        <input
          className="w-full text-md text-center items-center mb-2"
          type="text"
          placeholder="Proposals spreadsheet id: 1fgmYoJMn6282jzdfjsHsdsd788UYc_xUITy6hIL6"
          value={proposalSpreadsheetId}
          onChange={(e) => setProposalSpreadsheetId(e.target.value)}
        />
        <input
          className="w-full text-md text-center items-center mb-2"
          type="text"
          placeholder="Proposals sheet name: Sheet1"
          value={proposalSheetId}
          onChange={(e) => setProposalSheetId(e.target.value)}
        />
        {showConfig && (
          <>
            <input
              className="w-full text-md text-center items-center mb-2"
              type="text"
              placeholder="Columns should be same: 'from,to'"
              value={propsToBeEqual}
              onChange={(e) => setPropsToBeEqual(e.target.value)}
            />
            <input
              className="w-full text-md text-center items-center mb-2"
              type="text"
              placeholder="Columns should be >= 'seats'"
              value={propsToBeGreater}
              onChange={(e) => setPropsToBeGreater(e.target.value)}
            />
            <input
              className="w-full text-md text-center items-center mb-2"
              type="text"
              placeholder="Columns should be ignored: 'telegram,phone'"
              value={propsToIgnore}
              onChange={(e) => setPropsToIgnore(e.target.value)}
            />
            <input
              className="w-full text-md text-center items-center mb-2"
              type="text"
              placeholder="Columns to filter by: 'status'"
              value={propsToFilter}
              onChange={(e) => setPropsToFilter(e.target.value)}
            />
            <input
              className="w-full text-md text-center items-center mb-2"
              type="text"
              placeholder="Values to filter by for columns above: 'done'"
              value={valuesToFilter}
              onChange={(e) => setValuesToFilter(e.target.value)}
            />
          </>
        )}
        <select value={slug} onChange={(event) => setSlug(event.target.value)}>
          <option value="generic">Generic matching</option>
          <option value="un-refugee">Refugee for UN matching</option>
        </select>
        <button
          disabled={isLoading || !isValid(matchRequest)}
          className={styles.card}
          onClick={fetchMacthes}
        >
          Find matches
        </button>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </div>
      <table className={styles.matches}>
        <thead>
          <tr>
            <th>Request</th>
            <th>Proposals</th>
            {!!showConnect && <th>Connect</th>}
          </tr>
        </thead>
        <tbody>
          {matches.map((match: Match) => (
            <Match
              key={match.requestId}
              match={match}
              request={matchRequest}
              showConnect={!!showConnect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Room;
