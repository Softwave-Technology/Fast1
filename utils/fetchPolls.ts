import { supabase } from './supabase';

export const getActivePolls = async () => {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .gt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error fetching polls:', error);
    return null;
  }
  return data;
};

export const submitVote = async (pollId: string, userId: string, vote: string) => {
  const { error } = await supabase
    .from('poll_votes')
    .upsert({ poll_id: pollId, user_id: userId, vote }, { onConflict: 'poll_id, user_id' });

  if (error) {
    console.error('Error submitting vote:', error);
    return false;
  }
  return true;
};

export const getUserVote = async (pollId: string, userId: string) => {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('vote')
    .eq('poll_id', pollId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user vote:', error);
    return null;
  }
  return data?.vote;
};

export const getPollResults = async (pollId: string) => {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('vote, count:count(*)')
    .eq('poll_id', pollId)
    .order('count', { ascending: false });

  if (error) {
    console.error('Error fetching poll results:', error);
    return [];
  }
  return data;
};
