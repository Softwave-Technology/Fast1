import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

// Define a type for winners
type Winner = {
  year: number;
  winner: string;
  team: string;
};

export default function LastWinners() {
  const [winners, setWinners] = useState<Winner[]>([]); // Explicitly set type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastWinners = async () => {
      try {
        // Fetch next race to get circuitId
        const nextRaceRes = await fetch('https://api.jolpi.ca/ergast/f1/current/next.json');
        const nextRaceData = await nextRaceRes.json();
        const circuit = nextRaceData.MRData.RaceTable.Races[0]?.Circuit;

        if (!circuit) {
          throw new Error('Next race circuit not found.');
        }

        const circuitId = circuit.circuitId;
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - (i + 1));

        // Fetch last 5 winners
        const winnerPromises = years.map(async (year) => {
          const response = await fetch(
            `https://api.jolpi.ca/ergast/f1/${year}/circuits/${circuitId}/results/1.json`
          );
          const data = await response.json();
          const race = data.MRData.RaceTable.Races[0];

          return {
            year,
            winner: race?.Results?.[0]?.Driver?.familyName || 'No Race',
            team: race?.Results?.[0]?.Constructor?.name || 'No Team',
          };
        });

        const winnersData: Winner[] = await Promise.all(winnerPromises);
        setWinners(winnersData);
      } catch (error) {
        console.error('Failed while fetching winners! ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastWinners();
  }, []);

  if (loading) {
    return <ActivityIndicator className="p-2" />;
  }

  return (
    <View className="m-2 flex-1 bg-[#2a2a2a] p-4">
      <Text className="mb-4 text-3xl font-bold text-white">Last Wins</Text>
      {winners.map((winner) => (
        <View key={winner.year} className="mb-2">
          <Text className="text-xl text-white">
            {winner.year}: {winner.winner} ({winner.team})
          </Text>
        </View>
      ))}
    </View>
  );
}
