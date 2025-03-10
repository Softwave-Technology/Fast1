import { Slot } from 'expo-router';

import AuthContextProvider from '~/context/AuthContext';

import '../global.css';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
