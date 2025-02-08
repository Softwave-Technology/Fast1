import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { DriverStanding } from '~/types/types';

export default function TopDrivers() {
  const [loading, setLoading] = useState(true);
  const [topDrivers, setTopDrivers] = useState<DriverStanding[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverStandings = async () => {
      try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const drivers = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];

        setTopDrivers(drivers.slice(0, 3));
      } catch (err) {
        setError('Failed to fetch driver standings. Please try again.');
        console.error('Error fetching driver standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverStandings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
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

  if (topDrivers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-white">No driver standings available yet.</Text>
      </View>
    );
  }

  const positionStyles = ['text-red-500', 'text-blue-500', 'text-yellow-500'];

  return (
    <View className="p-4">
      <Text className="mb-3 text-2xl font-bold text-white">Top 3 Drivers</Text>
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
