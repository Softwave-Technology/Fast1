import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import Loading from './Loading';

type Winner = {
  year: number;
  winner: string;
  team: string;
};

export default function LastWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastWinners = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch next race to get circuitId
        const nextRaceRes = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
        if (!nextRaceRes.ok) {
          throw new Error('Failed to fetch next race.');
        }
        const nextRaceData = await nextRaceRes.json();
        const circuit = nextRaceData?.MRData?.RaceTable?.Races?.[0]?.Circuit;

        if (!circuit) {
          throw new Error('Next race circuit not found.');
        }

        const circuitId = circuit.circuitId;
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - (i + 1));

        // Fetch last 5 winners
        const winnerPromises = years.map(async (year) => {
          try {
            const response = await fetch(
              `https://api.jolpi.ca/ergast/f1/${year}/circuits/${circuitId}/results/1.json`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch results for ${year}`);
            }
            const data = await response.json();
            const race = data?.MRData?.RaceTable?.Races?.[0];

            return {
              year,
              winner: race?.Results?.[0]?.Driver?.familyName || 'No Race',
              team: race?.Results?.[0]?.Constructor?.name || 'No Team',
            };
          } catch (err) {
            console.log(`Error fetching year ${year}:`, err);
            return { year, winner: 'No Data', team: 'No Data' };
          }
        });

        const winnersData: Winner[] = await Promise.all(winnerPromises);
        setWinners(winnersData);
      } catch (error: any) {
        console.log('Error fetching winners:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLastWinners();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View className="flex-1 p-4">
        <Text className="text-xl text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-3xl font-bold text-white">Last Winners</Text>
      <View className="bg-[#2a2a2a] p-2">
        {winners.map((winner) => (
          <View key={winner.year} className="mb-2">
            <Text className="text-xl text-white">
              {winner.year}: {winner.winner} ({winner.team})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
