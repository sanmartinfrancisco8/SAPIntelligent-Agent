
"use client";

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useAdminRole() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (isUserLoading) {
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setIsCheckingRole(false);
        return;
      }

      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user, isUserLoading, firestore]);

  return { isAdmin, isLoading: isUserLoading || isCheckingRole };
}
