import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import Loading from '~/components/Loading';
import UpcomingRace from '~/components/UpcomingRace';
import { Driver } from '~/types/types';

export default function PollPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.jolpi.ca/ergast/f1/2025/drivers.json');
      const data = await response.json();
      const driverList = data?.MRData?.DriverTable?.Drivers || [];
      setDrivers(driverList);
    } catch (error) {
      console.log('Error while fetching drivers ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-[#11100f]">
      <View>
        <UpcomingRace />
      </View>
      {drivers.length === 0 ? (
        <Text className="mt-4 text-center text-white">No drivers found.</Text>
      ) : (
        drivers.map((driver) => (
          <Text key={driver.driverId} className="text-white">
            {driver.givenName} {driver.familyName}
          </Text>
        ))
      )}
    </View>
  );
}
