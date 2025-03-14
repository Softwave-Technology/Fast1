import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

import { getPoll, createPollForNextRace, submitVote } from '../../utils/fetchPolls';

import UpcomingRace from '~/components/UpcomingRace';
import { supabase } from '~/utils/supabase';

export default function PollPage() {
  const [poll, setPoll] = useState<{ id: string; question: string } | null>(null);
  const [drivers, setDrivers] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) return;
      setUserId(data.session.user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const loadPoll = async () => {
      let activePoll = await getPoll();
      if (!activePoll) {
        activePoll = await createPollForNextRace();
      }
      setPoll(activePoll);
      setDrivers(activePoll?.options || []);
    };
    loadPoll();
  }, []);

  const handleVote = async () => {
    if (!poll?.id || !userId || !selectedDriver) {
      alert('Please select a driver to vote.');
      return;
    }
    const success = await submitVote(poll.id, userId, selectedDriver);
    if (success) {
      alert('Vote submitted successfully!');
    } else {
      alert('Error submitting vote. Try again.');
    }
  };

  return (
    <View className="flex-1 bg-[#11100f] p-4">
      <ScrollView>
        <UpcomingRace />

        {poll ? (
          <View className="mt-6">
            {poll.question ? (
              <Text className="text-center text-lg font-bold text-white">{poll.question}</Text>
            ) : (
              <Text className="text-center text-gray-400">Poll is not available.</Text>
            )}

            <View className="mt-4">
              {drivers.map((driver) => (
                <Pressable
                  key={driver}
                  className={`my-2 rounded-lg p-3 ${selectedDriver === driver ? 'bg-red-500' : 'bg-gray-800'}`}
                  onPress={() => setSelectedDriver(driver)}>
                  <Text className="text-white">{driver}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text className="mt-6 text-gray-400">Loading poll...</Text>
        )}
      </ScrollView>
      <Pressable
        className={`m-2 mb-4 items-center rounded-lg p-4 ${selectedDriver ? 'bg-red-600' : 'bg-gray-500'}`}
        disabled={!selectedDriver}
        onPress={handleVote}>
        <Text className="font-2xl font-bold text-white">VOTE</Text>
      </Pressable>
    </View>
  );
}
