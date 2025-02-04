import { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { supabase } from '~/utils/supabase';

// Define the shape of the AuthContext value
interface AuthContextType {
  session: Session | null;
  user: User | null;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook with TypeScript safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
