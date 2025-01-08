// src/components/withAuth.js
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use App Router's navigation API

const withAuth = (WrappedComponent, requiredRole = null) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else if (requiredRole && user.role !== requiredRole) {
        router.push("/"); // Redirect if user doesn't have the required role
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
