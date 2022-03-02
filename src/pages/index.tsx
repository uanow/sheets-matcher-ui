import { useEffect, useState } from 'react';
import { Match } from '../match/types';
import styles from '../styles/Home.module.css';

const Match = (props: Match) => {
  return (
    <tr key={props.requestId}>
      <td>{props.requestId}</td>
      <td>{props.proposalIds.join(' ')}</td>
    </tr>
  );
};

const List = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    fetch('/api/matches')
      .then((response) => response.json())
      .then((json) => {
        console.log({ json });
        setMatches(json.matches);
      });
  }, []);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Matches</h1>
      <table className={styles.matches}>
        <thead>
          <tr>
            <th>Request</th>
            <th>Proposals</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match: Match) => (
            <Match key={match.requestId} {...match} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
