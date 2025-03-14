import { supabase } from './supabase';

import { Driver } from '~/types/types';

export const fetchNextRace = async () => {
  const response = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
  const data = await response.json();
  const fetchedRaces = data.MRData.RaceTable.Races;

  const upcomingRace = fetchedRaces.find(
    (race: { date: string; time: string }) => new Date(`${race.date}T${race.time}`) > new Date()
  );
  return upcomingRace;
};

export const fetchDriverNames = async () => {
  const response = await fetch('https://api.jolpi.ca/ergast/f1/current/drivers.json');
  const data = await response.json();
  const driverNames = data.MRData.DriverTable.Drivers.map(
    (driver: Driver) => driver.givenName + ' ' + driver.familyName
  );
  return driverNames;
};

export const createPollForNextRace = async () => {
  const race = await fetchNextRace();
  if (!race) {
    console.log('No upcoming race found.');
    return null;
  }
  const driverNames = await fetchDriverNames();
  if (!driverNames.lenght) {
    console.log('No driver names found');
    return null;
  }

  const { data: existingPoll } = await supabase
    .from('polls')
    .select('*')
    .eq('race_id', race.round)
    .single();

  if (existingPoll) {
    console.log('Poll already exist. ', existingPoll);
    return existingPoll;
  }
  const { data: newPoll, error } = await supabase
    .from('polls')
    .insert([
      {
        race_id: race.round,
        questions: `Who will win the ${race.raceName}?`,
        options: driverNames,
        expires_at: `${race.date}T23:59:59Z`,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.error('Error while creating new poll', error);
    return null;
  }

  return newPoll;
};

export const getPoll = async () => {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) {
    console.error('Error while fetching poll', error);
    return null;
  }
  return data;
};

export const submitVote = async (pollId: string, userId: string, selectedDriver: string) => {
  const { error } = await supabase
    .from('poll_votes')
    .upsert(
      { poll_id: pollId, user_id: userId, vote: selectedDriver },
      { onConflict: 'poll_id, user_id' }
    );

  if (error) {
    console.error('Error while submitting vote', error);
    return false;
  }
  return true;
};

export const getPollResults = async (pollId: string) => {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('vote, count:vote', { head: false, count: 'exact' })
    .eq('poll_id', pollId)
    .order('count', { ascending: false });

  if (error) {
    console.error('Error fetching poll results:', error);
    return [];
  }

  return data.map((item: any) => ({
    vote: item.vote,
    count: item.count || 0,
  }));
};
