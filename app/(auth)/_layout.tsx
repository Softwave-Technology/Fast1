import { User } from '@supabase/supabase-js';
import { Redirect, Slot } from 'expo-router';

import { useAuth } from '~/context/AuthContext';
export default function AuthLayout() {
  const { user }: User | any = useAuth();

  if (user) return <Redirect href="/(tabs)" />;

  return <Slot />;
}
