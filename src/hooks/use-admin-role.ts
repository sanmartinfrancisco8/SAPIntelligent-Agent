
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
      // If the user object is loading, we can't check the role yet.
      if (isUserLoading) {
        setIsCheckingRole(true);
        return;
      }
      
      // If there's no user, they're definitely not an admin.
      if (!user) {
        setIsAdmin(false);
        setIsCheckingRole(false);
        return;
      }

      // If we have a user, check their role in Firestore.
      setIsCheckingRole(true);
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
