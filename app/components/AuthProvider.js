// components/AuthProvider.js
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function AuthProvider({ children }) {


 
const { data: session, status } = useSession();


  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      });
    } else {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  if (status === 'loading') return <p>Loading...</p>;

  return children;
}