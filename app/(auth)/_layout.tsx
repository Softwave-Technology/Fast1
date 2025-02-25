import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Slot } from 'expo-router';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href="./(tabs)" />;
  return <Slot />;
}
