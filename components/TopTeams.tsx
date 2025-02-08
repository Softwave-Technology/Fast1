import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { ConstructorStanding } from '~/types/types';

export default function TopConstructors() {
  const [loading, setLoading] = useState(true);
  const [topConstructors, setTopConstructors] = useState<ConstructorStanding[]>([]);

  useEffect(() => {
    const fetchConstructorStandings = async () => {
      try {
        const response = await fetch(
          'https://api.jolpi.ca/ergast/f1/current/constructorStandings.json'
        );
        const data = await response.json();
        const constructors = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

        const topThree = constructors.slice(0, 3);
        setTopConstructors(topThree);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching constructor standings:', error);
        setLoading(false);
      }
    };

    fetchConstructorStandings();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const positionStyles = ['text-red-500', 'text-blue-500', 'text-yellow-500'];

  return (
    <View className="p-4">
      <Text className="mb-3 text-2xl font-bold text-white">Constructors</Text>
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
