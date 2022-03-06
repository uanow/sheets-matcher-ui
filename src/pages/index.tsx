import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isValid, Match, MatchRequest } from '../match/types';
import styles from '../styles/Home.module.css';
import { slugify } from '../utils/utils';

const Match = ({
  match,
  request,
  showConnect,
  chatId,
  columnsSendToChat,
}: {
  match: Match;
  request: MatchRequest;
  showConnect: boolean;
  chatId: string;
  columnsSendToChat: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const requestWithMatch: MatchRequest = {
    ...request,
    requestIdsToFilter: [match.requestId],
    proposalIdsToFilter: match.proposalIds,
    chatId,
    columnsSendToChat,
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

export const MatchesTable = ({
  matches,
  matchRequest,
  showConnect,
  chatId,
  columnsSendToChat,
}: {
  matches: Match[];
  matchRequest: MatchRequest;
  showConnect: boolean;
  chatId: string;
  columnsSendToChat: string;
}) => {
  return (
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
            chatId={chatId}
            columnsSendToChat={columnsSendToChat}
          />
        ))}
      </tbody>
    </table>
  );
};

const Room: NextPage = () => {
  const router = useRouter();
  const {
    config: showConfig = false,
    connect: showConnect = false,
    chatid: showChatId = false,
    save: showSaveConfig = false,
  } = router.query || {};
  const [error, setError] = useState('');

  const [chatId, setChatId] = useState('');
  const [columnsSendToChat, setColumnsSendToChat] = useState('');

  const [propsToBeEqual, setPropsToBeEqual] = useState('');
  const [propsToBeGreater, setPropsToBeGreater] = useState('');
  // TODO: Consider mark columns in spreadhseet, so they are ignored (color/note etc). So all setup could be made there.
  const [propsToIgnore, setPropsToIgnore] = useState('contact,phone,telegram,facebook');
  const [propsToHaveCommonWords, setPropsToHaveCommonWords] = useState('');
  const [propsToFilter, setPropsToFilter] = useState('');
  const [valuesToFilter, setValuesToFilter] = useState('');

  const [slugInput, setSlugInput] = useState('');
  const [slug, setSlug] = useState('');
  useEffect(() => setSlug(slugify(slugInput)), [slugInput]);

  const [matchType, setMatchType] = useState('generic');
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
    propsToHaveCommonWords,
    propsToFilter,
    valuesToFilter,
    chatId,
    columnsSendToChat,
  });
  useEffect(() => {
    setMatchRequest({
      requestSpreadsheetId,
      requestSheetId,
      proposalSpreadsheetId,
      proposalSheetId,
      slug,
      matchType,
      propsToBeEqual,
      propsToBeGreater,
      propsToIgnore,
      propsToHaveCommonWords,
      propsToFilter,
      valuesToFilter,
      chatId,
      columnsSendToChat,
    });
  }, [
    requestSpreadsheetId,
    requestSheetId,
    proposalSpreadsheetId,
    proposalSheetId,
    slug,
    matchType,
    propsToBeEqual,
    propsToBeGreater,
    propsToIgnore,
    propsToHaveCommonWords,
    propsToFilter,
    valuesToFilter,
    chatId,
    columnsSendToChat,
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

  const saveMatchRequest = async () => {
    if (!isValid(matchRequest)) return;
    if (!slug.includes('-')) {
      setError('Please, use 2 words for slug to make it more unique');
    }

    try {
      setError('');
      setIsLoading(true);
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ ...matchRequest }),
      });
      setIsLoading(false);
      if (!response.ok) setError('Please, ask administrator to get access.');
      //router.push(`/${matchRequest.slug}`);
    } catch (error) {
      console.log({ error });
      setError('Please, check spreadhseet id and name.');
      setIsLoading(false);
    }
  };

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
              placeholder="Columns should have common words: 'list'"
              value={propsToHaveCommonWords}
              onChange={(e) => setPropsToHaveCommonWords(e.target.value)}
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
            {showChatId && (
              <>
                <input
                  className="w-full text-md text-center items-center mb-2"
                  type="text"
                  placeholder="Telegram chat id"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
                <input
                  className="w-full text-md text-center items-center mb-2"
                  type="text"
                  placeholder="Columns to send to telegram chat id"
                  value={columnsSendToChat}
                  onChange={(e) => setColumnsSendToChat(e.target.value)}
                />
              </>
            )}
          </>
        )}
        <select value={matchType} onChange={(event) => setMatchType(event.target.value)}>
          <option value="generic">Generic matching</option>
          <option value="un-refugee">Refugee for UN matching</option>
        </select>
        <div className="flex flex-col">
          {showSaveConfig && (
            <>
              <input
                className="w-full text-md text-center items-center mb-2 mt-4"
                type="text"
                placeholder="Slug to save config to"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
              />
              <p>{`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`}</p>
              <button
                disabled={isLoading || !isValid(matchRequest) || !slug}
                className={styles.card}
                onClick={saveMatchRequest}
              >
                Save
              </button>
            </>
          )}
          <button
            disabled={isLoading || !isValid(matchRequest)}
            className={styles.card}
            onClick={fetchMacthes}
          >
            Find matches
          </button>
        </div>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </div>
      <MatchesTable
        matches={matches}
        matchRequest={matchRequest}
        showConnect={!!showConnect}
        chatId={chatId}
        columnsSendToChat={columnsSendToChat}
      />
    </div>
  );
};

export default Room;
