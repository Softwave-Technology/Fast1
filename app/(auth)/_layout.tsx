import { Redirect, Slot } from 'expo-router';

import { useAuth } from '~/context/AuthContext';

export default function AuthLayout() {
  const { user }: any = useAuth();

  if (user) return <Redirect href="/" />;
  return <Slot />;
}
