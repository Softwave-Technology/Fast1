import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, View, Text } from 'react-native';

import ConstructorListItem from '~/components/ConstructorListItem';
import DriverListItem from '~/components/DriverListItem';
import Loading from '~/components/Loading';
import YearSelector from '~/components/YearSelector';
import { ConstructorStanding, DriverStanding } from '~/types/types';

export default function DriverStandings() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeStandings, setActiveStandings] = useState<'drivers' | 'constructors'>('drivers');

  useEffect(() => {
    setLoading(true);
    const fetchDriverStandings = async (year: string) => {
      const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
      const data = await response.json();
      setDrivers(data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []);
      setLoading(false);
    };

    const fetchConstructorStandings = async (year: string) => {
      const response = await fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/constructorStandings.json`
      );
      const data = await response.json();
      setConstructors(data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []);
      setLoading(false);
    };

    if (selectedYear) {
      fetchConstructorStandings(selectedYear);
      fetchDriverStandings(selectedYear);
    }
  }, [selectedYear]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Standings' }} />
        <Loading />
      </>
    );
  }

  return (
    <View className="flex-1 bg-[#11100f]">
      <StatusBar style="light" />
      <Stack.Screen options={{ title: 'Standings' }} />
      <View className="flex-row items-center justify-center gap-5 p-4">
        <Pressable
          className="w-1/2 rounded-xl bg-red-600 p-2"
          onPress={() => setActiveStandings('drivers')}
          style={
            activeStandings === 'drivers' && {
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: '#B91C1C',
            }
          }>
          <Text className="text-center text-xl font-bold text-white">Drivers</Text>
        </Pressable>
        <Pressable
          className="w-1/2 rounded-xl bg-red-600 p-2"
          onPress={() => setActiveStandings('constructors')}
          style={
            activeStandings === 'constructors' && {
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: '#B91C1C',
            }
          }>
          <Text className="text-center text-xl font-bold text-white">Constructors</Text>
        </Pressable>
      </View>
      <View className="px-2 pb-2">
        <YearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </View>
      {activeStandings === 'drivers' ? (
        drivers.length > 0 ? (
          <FlashList
            data={drivers}
            keyExtractor={(item: DriverStanding) => item.Driver.familyName}
            renderItem={({ item }) => <DriverListItem item={item} />}
            estimatedItemSize={200}
          />
        ) : (
          <Text className="mt-10 text-center text-xl font-bold text-white">
            No driver standings available yet.
          </Text>
        )
      ) : constructors.length > 0 ? (
        <FlashList
          data={constructors}
          keyExtractor={(item: ConstructorStanding) => item.Constructor.name}
          renderItem={({ item }) => <ConstructorListItem item={item} />}
          estimatedItemSize={200}
        />
      ) : (
        <Text className="mt-10 text-center text-xl font-bold text-white">
          No constructor standings available yet.
        </Text>
      )}
      <View />
    </View>
  );
}
