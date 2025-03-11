import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Loading from './Loading';

import { Race } from '~/types/types';

type NextRace = Race | null;

export default function RaceSchedule() {
  const [schedule, setSchedule] = useState<Race[]>([]);
  const [nextRace, setNextRace] = useState<NextRace | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRaceSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
        const data = await response.json();
        const fetchedRaceSchedule = data.MRData.RaceTable.Races;
        setSchedule(fetchedRaceSchedule);
        const upcomingRace = fetchedRaceSchedule.find(
          (race: { date: string; time: string }) =>
            new Date(`${race.date}T${race.time}`) > new Date()
        );
        setNextRace(upcomingRace);
      } catch (error) {
        console.log('An error occured while fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRaceSchedule();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (schedule.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-white">No upcoming race found!</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="mb-2 text-3xl font-bold text-white">Race Schedule</Text>
      <View className="bg-[#2a2a2a] p-2">
        <View className="gap-2">
          {nextRace?.FirstPractice?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Free Practice 1 :{' '}
                {new Date(
                  `${nextRace.FirstPractice?.date}T${nextRace.FirstPractice?.time}`
                ).toLocaleString()}
              </Text>
              {nextRace?.FirstPractice?.date &&
                nextRace?.FirstPractice?.time &&
                new Date(`${nextRace.FirstPractice.date}T${nextRace.FirstPractice.time}`) <=
                  new Date() && <MaterialIcons name="check" size={24} color="green" />}
            </View>
          )}
          {nextRace?.SecondPractice?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Free Practice 2 :{' '}
                {new Date(
                  `${nextRace.SecondPractice?.date}T${nextRace.SecondPractice?.time}`
                ).toLocaleString()}
              </Text>
              {nextRace?.SecondPractice?.date &&
                nextRace?.SecondPractice?.time &&
                new Date(`${nextRace.SecondPractice.date}T${nextRace.SecondPractice.time}`) <=
                  new Date() && <MaterialIcons name="check" size={24} color="green" />}
            </View>
          )}
          {nextRace?.ThirdPractice?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Free Practice 2 :{' '}
                {new Date(
                  `${nextRace.ThirdPractice?.date}T${nextRace.ThirdPractice?.time}`
                ).toLocaleString()}
              </Text>
              {nextRace?.ThirdPractice?.date &&
                nextRace?.ThirdPractice?.time &&
                new Date(`${nextRace.ThirdPractice.date}T${nextRace.ThirdPractice.time}`) <=
                  new Date() && <MaterialIcons name="check" size={24} color="green" />}
            </View>
          )}
          {nextRace?.Sprint?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Sprint Race :{' '}
                {new Date(`${nextRace.Sprint?.date}T${nextRace.Sprint?.time}`).toLocaleString()}
              </Text>
              {nextRace?.Sprint?.date &&
                nextRace?.Sprint?.time &&
                new Date(`${nextRace.Sprint.date}T${nextRace.Sprint.time}`) <= new Date() && (
                  <MaterialIcons name="check" size={24} color="green" />
                )}
            </View>
          )}
          {nextRace?.Qualifying?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Qualifying :{' '}
                {new Date(
                  `${nextRace.Qualifying?.date}T${nextRace.Qualifying?.time}`
                ).toLocaleString()}
              </Text>
              {nextRace?.Qualifying?.date &&
                nextRace?.Qualifying?.time &&
                new Date(`${nextRace.Qualifying.date}T${nextRace.Qualifying.time}`) <=
                  new Date() && <MaterialIcons name="check" size={24} color="green" />}
            </View>
          )}
          {nextRace?.time && (
            <View className="flex-row">
              <Text className="flex-1 text-lg font-semibold text-white">
                Race : {new Date(`${nextRace?.date}T${nextRace?.time}`).toLocaleString()}
              </Text>
              {nextRace?.date &&
                nextRace?.time &&
                new Date(`${nextRace.date}T${nextRace.time}`) <= new Date() && (
                  <MaterialIcons name="check" size={24} color="green" />
                )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
