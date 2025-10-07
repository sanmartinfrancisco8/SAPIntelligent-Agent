
"use client";

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

type UserProfile = {
  role?: 'admin' | 'user' | 'pending';
};

export function useAdminRole() {
  const { user, isUserLoading } = useUser();
  
  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    const firestore = useFirestore();
    return doc(firestore, 'users', user.uid);
  }, [user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
        setIsAdmin(!!user && userProfile?.role === 'admin');
    }
  }, [user, isUserLoading, userProfile, isProfileLoading]);

  return { isAdmin, isLoading: isUserLoading || isProfileLoading };
}
