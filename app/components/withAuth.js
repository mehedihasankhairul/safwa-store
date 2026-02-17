// src/components/withAuth.js
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use App Router's navigation API

const withAuth = (WrappedComponent, requiredRole = null) => {
  return (props) => {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      // Set hydration flag first
      setIsHydrated(true);
      
      // Only access localStorage after component mounts
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        
        let user = null;
        if (userStr && userStr !== 'undefined') {
          try {
            user = JSON.parse(userStr);
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem("user");
          }
        }

        if (!token || !user) {
          router.push("/login"); // Redirect to login if not authenticated
        } else if (requiredRole && user.role !== requiredRole) {
          router.push("/"); // Redirect if user doesn't have the required role
        }
      }
    }, [router, requiredRole]);

    // Don't render until hydrated
    if (!isHydrated) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
