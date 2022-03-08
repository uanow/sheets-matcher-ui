import { getMatches } from '../match/match';
import { Match, MatchRequest } from '../match/types';
import { loadMatchRequest } from '../utils/supabase';
import styles from '../styles/Home.module.css';
import MatchesTable from '../components/matches';

function MatchPage({ matchRequest, matches }: { matchRequest: MatchRequest; matches: Match[] }) {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Matches</h1>
      <MatchesTable matches={matches} matchRequest={matchRequest} showConnect={false} />
    </div>
  );
}

export const getServerSideProps = async (context: { query: { room: any } }) => {
  const { room } = context.query;
  const { data: matchRequest, error } = await loadMatchRequest(room);

  if (!matchRequest) {
    return {
      notFound: true,
    };
  }

  try {
    const matches = await getMatches(matchRequest);
    return { props: { matchRequest, matches } };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default MatchPage;
