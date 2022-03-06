import styles from '../styles/Home.module.css';
import { Match, MatchRequest } from '../match/types';
import MatchComponent from './match';

export const MatchesTable = ({
  matches,
  matchRequest,
  showConnect,
}: {
  matches: Match[];
  matchRequest: MatchRequest;
  showConnect: boolean;
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
          <MatchComponent
            key={match.requestId}
            match={match}
            request={matchRequest}
            showConnect={!!showConnect}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MatchesTable;
