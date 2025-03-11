import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Loading from './Loading';

import { ConstructorStanding } from '~/types/types';

export default function TopConstructors() {
  const [loading, setLoading] = useState(true);
  const [topConstructors, setTopConstructors] = useState<ConstructorStanding[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConstructorStandings = async () => {
      try {
        const response = await fetch(
          'https://api.jolpi.ca/ergast/f1/current/constructorStandings.json'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const constructors =
          data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];

        setTopConstructors(constructors.slice(0, 3));
      } catch (err) {
        setError('Failed to fetch constructor standings. Please try again.');
        console.error('Error fetching constructor standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstructorStandings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Loading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-red-500">{error}</Text>
      </View>
    );
  }

  if (topConstructors.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-white">
          No constructor standings available yet.
        </Text>
      </View>
    );
  }

  const positionStyles = ['text-red-500', 'text-blue-500', 'text-yellow-500'];

  return (
    <View className="p-4">
      <Text className="mb-3 text-2xl font-bold text-white">Top 3 Constructors</Text>
      {topConstructors.map((constructor, index) => (
        <View key={constructor.Constructor.constructorId} className="mb-2">
          <Text className={`text-xl font-bold ${positionStyles[index]}`}>
            {index + 1}. {constructor.Constructor.name}
          </Text>
          <Text className="text-lg font-semibold text-white">Points: {constructor.points}</Text>
          <Text className="text-lg font-semibold text-white">Wins: {constructor.wins}</Text>
        </View>
      ))}
    </View>
  );
}
