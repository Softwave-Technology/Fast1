import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Loading from './Loading';

import { Race } from '~/types/types';

type NextRace = Race | null;

export default function UpcomingRace() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextRace, setNextRace] = useState<NextRace | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setLoading(true);
    const fetchRaces = async () => {
      try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
        const data = await response.json();
        const fetchedRaces = data.MRData.RaceTable.Races;
        setRaces(fetchedRaces);

        const upcomingRace = fetchedRaces.find(
          (race: { date: string; time: string }) =>
            new Date(`${race.date}T${race.time}`) > new Date()
        );
        setNextRace(upcomingRace);
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  useEffect(() => {
    if (nextRace) {
      const interval = setInterval(() => {
        const raceDate = new Date(nextRace.date + 'T' + nextRace.time);
        const currentTime = new Date();
        const timeDifference = raceDate.getTime() - currentTime.getTime();

        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
          const seconds = Math.floor((timeDifference / 1000) % 60);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextRace]);

  if (loading) {
    return <Loading />;
  }

  if (!races) {
    return <Text className="text-xl font-bold text-red-500">No races have been found!</Text>;
  }

  return (
    <View className="mt-3 p-2">
      <View>
        <Text className="p-2 text-4xl font-bold text-white ">Upcoming Race</Text>
        {nextRace ? (
          <View className="m-1 gap-2 rounded-lg bg-[#2a2a2a] p-2">
            <Text className="text-xl font-semibold text-white">{nextRace.raceName}</Text>
            <Text className="text-md text-white">{nextRace.Circuit.circuitName}</Text>
            <Text className="text-sm text-white">
              {new Date(`${nextRace.date}T${nextRace.time}`).toLocaleString()}
            </Text>
          </View>
        ) : (
          <Text className="text-sm text-gray-500">No upcoming race available</Text>
        )}
      </View>
      <View className="m-2 mt-2 items-center border border-yellow-400 p-2">
        <Text className="mt-2 text-4xl font-bold text-red-600">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </Text>
      </View>
    </View>
  );
}
