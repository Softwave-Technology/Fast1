import { FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '~/context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#FF1E00',
        tabBarStyle: { backgroundColor: '#2a2a2a' },
        headerStyle: { backgroundColor: '#FF1E00' },
        tabBarShowLabel: false,
        headerTitleStyle: { color: 'white', fontWeight: 'bold', fontSize: 20 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="drivers"
        options={{
          title: 'Driver List',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="racing-helmet" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="races"
        options={{
          title: 'Races',
          tabBarIcon: ({ color }) => <FontAwesome5 name="flag-checkered" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: 'Standings',
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="circuit"
        options={{
          title: 'Circuits',
          tabBarIcon: ({ color }) => <FontAwesome name="map" size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}
