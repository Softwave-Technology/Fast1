import { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';

import { fetchDriverNames, getPoll, createPollForNextRace } from '../../utils/fetchPolls';

import UpcomingRace from '~/components/UpcomingRace';

export default function PollPage() {
  const [poll, setPoll] = useState<{ id: string; question: string } | null>(null);
  const [drivers, setDrivers] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  useEffect(() => {
    const loadPoll = async () => {
      let activePoll = await getPoll();

      if (!activePoll) {
        activePoll = await createPollForNextRace();
      }

      setPoll(activePoll);

      const driverList = await fetchDriverNames();
      setDrivers(driverList);
    };

    loadPoll();
  }, []);

  return (
    <View className="flex-1 bg-[#11100f] p-4">
      <UpcomingRace />

      {poll ? (
        <View className="mt-6">
          <Text className="text-lg font-bold text-white">{poll.question}</Text>

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
    </View>
  );
}
