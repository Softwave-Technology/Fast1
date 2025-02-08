import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { DriverStanding } from '~/types/types';

export default function TopDrivers() {
  const [loading, setLoading] = useState(true);
  const [topDrivers, setTopDrivers] = useState<DriverStanding[]>([]);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        const data = await response.json();
        const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const topThree = drivers.slice(0, 3);
        setTopDrivers(topThree);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching driver standings:', error);
        setLoading(false);
      }
    };

    fetchDriverStandings();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const positionStyles = ['text-red-500', 'text-blue-500', 'text-yellow-500'];

  return (
    <View className="p-4">
      <Text className="mb-3 text-2xl font-bold text-white">Drivers</Text>
      {topDrivers.map((driver, index) => (
        <View key={driver.Driver.driverId} className="mb-2">
          <Text className={`text-xl font-bold ${positionStyles[index]}`}>
            {index + 1}. {driver.Driver.givenName} {driver.Driver.familyName}
          </Text>
          <Text className="text-lg font-semibold text-white">Points: {driver.points}</Text>
          <Text className="text-lg font-semibold text-white">Wins: {driver.wins}</Text>
        </View>
      ))}
    </View>
  );
}
