import { Stack } from 'expo-router';

import AuthContextProvider from '~/context/AuthContext';

import '../global.css';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthContextProvider>
  );
}
