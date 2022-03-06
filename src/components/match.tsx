import { useState } from 'react';
import { Match, MatchRequest } from '../match/types';

const MatchComponent = ({
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

export default MatchComponent;
