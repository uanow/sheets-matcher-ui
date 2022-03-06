import { camelToSnake, MatchRequest, MatchRequestSnake, snakeToCamel } from './../match/types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const loadMatchRequest = async (slug: string) => {
  const { data, error } = await supabase
    .from<MatchRequestSnake>('match_requests')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data: data ? snakeToCamel(data) : null, error };
};

export const saveMatchRequest = async (matchRequest: MatchRequest) =>
  await supabase
    .from('match_requests')
    .insert(camelToSnake(matchRequest), { returning: 'minimal' });
