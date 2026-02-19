"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import useAuthStore from "../../../store/authStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Use separate selectors to avoid selector recreation issues
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const router = useRouter();

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);

    // Check if user is already logged in as admin
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.role === 'admin') {
          router.push('/admin');
        }
      } catch (e) {
        // Invalid stored user data, continue with login
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting login

    try {
      const { success, error, user } = await login(email, password);
      if (!success) {
        setError(error || "Login failed");
        return;
      }

      // Check if user is admin
      if (user && user.role === 'admin') {
        router.push("/admin");
      } else {
        setError("Access denied. Admin credentials required.");
        // Logout if not admin
        useAuthStore.getState().logout();
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  // Show loading during hydration to prevent SSR mismatch
  if (!isClient || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center">
            <CircularProgress size={32} className="text-red-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your administrator credentials</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter admin email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter admin password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Not an admin?{" "}
            <Link href="/" className="text-red-900 font-medium hover:underline">
              Go to Store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
