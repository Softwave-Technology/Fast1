import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Image, Text, Dimensions, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const slides = [
  {
    id: 1,
    title: 'Welcome to Fast 1',
    description: 'Get real-time F1 race results, standings, and more!',
    image: require('../../assets/onboarding/1.jpg'),
  },
  {
    id: 2,
    title: 'Live Race Updates',
    description: 'Stay updated with live race standings and results.',
    image: require('../../assets/onboarding/2.jpg'),
  },
  {
    id: 3,
    title: 'Historical Data',
    description: 'View past season standings and race results.',
    image: require('../../assets/onboarding/3.jpg'),
  },
  {
    id: 4,
    title: 'Leaderboards',
    description: 'Take a look at standings between drivers and teams.',
    image: require('../../assets/onboarding/4.jpg'),
  },
];
export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnboarding = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/login');
  };
  return (
    <View className="flex-1">
      <Text
        className="absolute self-center text-3xl font-bold text-white"
        style={{ paddingTop: 75 }}>
        Fast <Text className="text-red-500">1</Text>
      </Text>
      <Carousel
        data={slides}
        loop={false}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height}
        containerStyle={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center p-4">
            <Image source={item.image} className="m-2 h-2/3 w-full" resizeMode="contain" />
            <Text className="text-2xl font-bold text-white">{item.title}</Text>
            <Text className="mt-2 text-center text-gray-400">{item.description}</Text>
          </View>
        )}
        onProgressChange={(_, index) => setCurrentIndex(index)}
      />
      {/* Dot Indicators */}
      <View className="absolute bottom-12 left-1/2 -translate-x-1/2 transform flex-row items-center gap-2 space-x-3">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-4 w-4 rounded-full ${index === currentIndex ? 'bg-red-600' : 'bg-gray-400'}`}
          />
        ))}
      </View>
      {currentIndex === slides.length - 1 && (
        <Pressable
          className="absolute bottom-10 left-10 right-10 rounded-lg bg-red-600 p-4"
          onPress={handleOnboarding}>
          <Text className="text-center font-bold text-white">Get Started</Text>
        </Pressable>
      )}
    </View>
  );
}
