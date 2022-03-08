import { camelToSnake, MatchRequest, MatchRequestSnake, snakeToCamel } from './../match/types';
import { createClient } from '@supabase/supabase-js';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const loadMatchRequest = async (slug: string) => {
  const { data, error } = await supabase
    .from<MatchRequestSnake>('match_requests')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data: data ? snakeToCamel(data) : null, error };
};

export const saveMatchRequest = async (matchRequest: MatchRequest) =>
  await supabaseClient
    .from('match_requests')
    .insert(camelToSnake(matchRequest), { returning: 'minimal' });
