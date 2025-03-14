import { supabase } from './supabase';

export const fetchNextRace = async () => {
  const response = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
  const data = await response.json();
  const fetchedRaces = data.MRData.RaceTable.Races;

  const upcomingRace = fetchedRaces.find(
    (race: { date: string; time: string }) => new Date(`${race.date}T${race.time}`) > new Date()
  );
  return upcomingRace || null;
};

// Manually defined driver names
export const drivers = [
  { givenName: 'George', familyName: 'Russell' },
  { givenName: 'Andrea Kimi', familyName: 'Antonelli' },
  { givenName: 'Charles', familyName: 'Leclerc' },
  { givenName: 'Lewis', familyName: 'Hamilton' },
  { givenName: 'Max', familyName: 'Verstappen' },
  { givenName: 'Liam', familyName: 'Lawson' },
  { givenName: 'Lando', familyName: 'Norris' },
  { givenName: 'Oscar', familyName: 'Piastri' },
  { givenName: 'Alexander', familyName: 'Albon' },
  { givenName: 'Carlos', familyName: 'Sainz' },
  { givenName: 'Fernando', familyName: 'Alonso' },
  { givenName: 'Lance', familyName: 'Stroll' },
  { givenName: 'Pierre', familyName: 'Gasly' },
  { givenName: 'Jack', familyName: 'Doohan' },
  { givenName: 'Yuki', familyName: 'Tsunoda' },
  { givenName: 'Isack', familyName: 'Hadjar' },
  { givenName: 'Esteban', familyName: 'Ocon' },
  { givenName: 'Oliver', familyName: 'Bearman' },
  { givenName: 'Nico', familyName: 'Hülkenberg' },
  { givenName: 'Gabriel', familyName: 'Bortoleto' },
];

// Returns list of full driver names
export const fetchDriverNames = () => {
  return drivers.map((driver) => `${driver.givenName} ${driver.familyName}`);
};

// Creates a poll for the next race
export const createPollForNextRace = async () => {
  const race = await fetchNextRace();
  if (!race) {
    console.log('No upcoming race found.');
    return null;
  }

  const driverNames = fetchDriverNames();
  if (driverNames.length === 0) {
    console.log('No driver names found');
    return null;
  }

  // Check if poll already exists
  const { data: existingPoll, error: pollCheckError } = await supabase
    .from('polls')
    .select('*')
    .eq('race_id', race.round)
    .single();

  if (pollCheckError && pollCheckError.code !== 'PGRST116') {
    console.error('Error checking for existing poll:', pollCheckError);
    return null;
  }

  if (existingPoll) {
    console.log('Poll already exists.', existingPoll);
    return existingPoll;
  }

  // Insert new poll
  const { data: newPoll, error: insertError } = await supabase
    .from('polls')
    .insert([
      {
        race_id: race.round,
        question: `Who will win the ${race.raceName}?`,
        options: driverNames,
        expires_at: `${race.date}T23:59:59Z`,
      },
    ])
    .select('*')
    .single();

  if (insertError) {
    console.error('Error creating new poll:', insertError);
    return null;
  }

  return newPoll;
};

// Fetches the latest poll
export const getPoll = async () => {
  const { data, error } = await supabase.from('polls').select('*').maybeSingle();

  if (error) {
    console.error('Error fetching poll:', error);
    return null;
  }

  return data;
};

// Submits a vote for a poll
export const submitVote = async (pollId: string, userId: string, selectedDriver: string) => {
  const { error } = await supabase
    .from('poll_votes')
    .upsert(
      { poll_id: pollId, user_id: userId, vote: selectedDriver },
      { onConflict: 'poll_id, user_id' }
    );

  if (error) {
    console.error('Error submitting vote:', error);
    return false;
  }
  return true;
};

// Gets poll results
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
