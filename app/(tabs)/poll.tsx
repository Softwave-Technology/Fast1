import { useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import { getPoll, createPollForNextRace, submitVote, getPollResults } from '../../utils/fetchPolls';

import UpcomingRace from '~/components/UpcomingRace';
import { supabase } from '~/utils/supabase';

export default function PollPage() {
  const [poll, setPoll] = useState<{ id: string; question: string } | null>(null);
  const [drivers, setDrivers] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [pollResults, setPollResults] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session?.user) return;
      setUserId(data.session.user.id);
    };
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadPoll = async () => {
        let activePoll = await getPoll();
        if (!activePoll) {
          activePoll = await createPollForNextRace();
        }
        setPoll(activePoll);
        setDrivers(activePoll?.options || []);
        const userVote = await fetchUserVote(activePoll.id);
        setSelectedDriver(userVote);
        const results = await getPollResults(activePoll.id);
        setPollResults(
          Object.entries(results).map(([name, count]) => ({
            name,
            count,
            color: getRandomColor(),
            legendFontColor: 'white',
            legendFontSize: 12,
          }))
        );
      };
      loadPoll();
    }, [])
  );

  const fetchUserVote = async (pollId: string) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      console.error('Error fetching session:', sessionError);
      return null;
    }

    const userId = sessionData.session.user.id;
    if (!userId) return null;

    const { data: userVote, error } = await supabase
      .from('poll_votes')
      .select('vote')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user vote:', error);
    }

    return userVote?.vote || null;
  };

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

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View className="flex-1 bg-[#11100f] p-4">
      <ScrollView>
        <UpcomingRace />
        {pollResults.length > 0 && (
          <View className="mt-6 items-center">
            <Text className="text-lg font-bold text-white">Poll Results</Text>
            <PieChart
              data={pollResults}
              width={Dimensions.get('window').width - 50}
              height={220}
              chartConfig={{
                backgroundColor: '#11100f',
                backgroundGradientFrom: '#11100f',
                backgroundGradientTo: '#11100f',
                color: () => `rgba(255, 255, 255, 1)`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}
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
