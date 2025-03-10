import { Slot } from 'expo-router';

import '../global.css';
import AuthContextProvider from '~/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
