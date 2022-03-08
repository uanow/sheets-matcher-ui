import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Match, MatchRequest } from '../match/types';
import styles from '../styles/Home.module.css';
import MatchesTable from '../components/matches';
import MatchesConfigComponent from '../components/config';
import { useUser } from '@supabase/supabase-auth-helpers/react';

const Room: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchRequest, setMatchRequest] = useState<MatchRequest>({
    proposalSheetId: '',
    proposalSpreadsheetId: '',
    requestSheetId: '',
    requestSpreadsheetId: '',
  });

  const {
    config: showConfig = false,
    connect: showConnect = false,
    chatid: showChatId = false,
    save: showSaveConfig = false,
  } = router.query || {};

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Matches</h1>
      {
        /*user &&*/ <MatchesConfigComponent
          showConfig={!!showConfig}
          showChatId={!!showChatId && !!user}
          showSaveConfig={!!user}
          matches={matches}
          setMatches={setMatches}
          matchRequest={matchRequest}
          setMatchRequest={setMatchRequest}
        />
      }
      <MatchesTable
        matches={matches}
        matchRequest={matchRequest}
        showConnect={!!showConnect && !!user}
      />
      {/* {user && (
        <>
          <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
          <p>{user?.email}</p>
        </>
      )} */}
    </div>
  );
};

export default Room;
