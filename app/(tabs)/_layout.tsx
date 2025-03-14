import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '~/context/AuthContext';
import { supabase } from '~/utils/supabase';

export default function TabLayout() {
  const { user }: any = useAuth();
  if (!user) return <Redirect href="/(auth)/onboarding" />;
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
          title: 'Racing',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={30} color={color} />,
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
        name="races"
        options={{
          title: 'Races',
          tabBarIcon: ({ color }) => <FontAwesome5 name="flag-checkered" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="poll"
        options={{
          title: 'Winner Prediction',
          tabBarIcon: ({ color }) => <FontAwesome5 name="poll" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="circuit"
        options={{
          title: 'Circuits',
          tabBarIcon: ({ color }) => <FontAwesome name="map" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={30} color={color} />,
          headerRight: () => (
            <FontAwesome
              name="power-off"
              size={20}
              color="white"
              className="p-2"
              onPress={() => supabase.auth.signOut()}
            />
          ),
        }}
      />
    </Tabs>
  );
}
