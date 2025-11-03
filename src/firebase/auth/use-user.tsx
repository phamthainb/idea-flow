'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';

type UserState = {
  user: User | null;
  loading: boolean;
  signedIn: boolean | undefined;
};

export function useUser() {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loading: true,
    signedIn: undefined,
  });

  useEffect(() => {
    if (!auth) {
      setUserState({ user: null, loading: false, signedIn: false });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState({
        user: user,
        loading: false,
        signedIn: !!user,
      });
    });

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
