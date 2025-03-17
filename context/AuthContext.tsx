import { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import Loading from '~/components/Loading';
import { supabase } from '~/utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAnonymous: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsAnonymous(data.session?.user?.app_metadata?.provider === 'anon');
      setIsReady(true);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsAnonymous(newSession?.user?.app_metadata?.provider === 'anon');
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signInAnonymously = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!isReady) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isAnonymous, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
