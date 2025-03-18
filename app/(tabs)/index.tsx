import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, Image, useWindowDimensions } from 'react-native';

// @ts-ignore
import banner from '../../assets/banner.jpg';

import LastWinners from '~/components/LastWinners';
import RaceSchedule from '~/components/RaceSchedule';
import TopDrivers from '~/components/TopDrivers';
import TopTeams from '~/components/TopTeams';
import UpcomingRace from '~/components/UpcomingRace';

export default function LandingPage() {
  const { width, height } = useWindowDimensions();
  return (
    <View className="flex-1 bg-[#11100f]">
      <ScrollView className="mb-10 flex-1" showsVerticalScrollIndicator={false}>
        <Image
          source={banner}
          style={{
            width,
            height: height / 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <Text className="mt-3 px-4 text-2xl font-bold text-white ">Upcoming Race</Text>
        <UpcomingRace />
        <LastWinners />
        <RaceSchedule />
        <Text className="p-4 text-2xl font-bold text-white">Championship</Text>
        <View className="m-2 flex-row justify-around border border-gray-400 p-2">
          <TopDrivers />
          <TopTeams />
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
}
