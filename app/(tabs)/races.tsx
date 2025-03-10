import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import Loading from '~/components/Loading';
import RaceListItem from '~/components/RaceListItem';
import YearSelector from '~/components/YearSelector';
import { Race } from '~/types/types';

export default function Home() {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRaces = async (year: string) => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`);
        const data = await response.json();

        if (data?.MRData?.RaceTable?.Races) {
          setRaces(data.MRData.RaceTable.Races);
        } else {
          setRaces([]);
        }
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear) {
      fetchRaces(selectedYear);
    }
  }, [selectedYear]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#11100f]">
        <Loading />
      </View>
    );
  }

  const handlePress = (race: Race) => {
    router.push(`/${selectedYear}/${race.round}`);
  };

  return (
    <View className="flex-1 bg-[#11100f]">
      {/* ✅ Correctly pass `setSelectedYear` */}
      <YearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

      <FlashList
        contentContainerStyle={{ padding: 2 }}
        keyExtractor={(item: Race) => item.round}
        data={races}
        estimatedItemSize={200}
        renderItem={({ item }) => (
          <Pressable className="p-1" onPress={() => handlePress(item)}>
            <RaceListItem item={item} />
          </Pressable>
        )}
      />

      <StatusBar style="light" />
    </View>
  );
}
