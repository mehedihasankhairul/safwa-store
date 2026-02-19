"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import useAuthStore from "../../store/authStore"; // Zustand auth store import
import { useCart } from "../../context/CartContext"; // Cart context import

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Use separate selectors to avoid selector recreation issues
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Get cart information from CartContext
  const { cartItems, totalItems } = useCart();

  const router = useRouter();

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting login
    try {
      const { success, error, user } = await login(email, password); // Use Zustand login method
      if (!success) {
        setError(error || "Login failed");
        return;
      }

      // Determine redirect destination based on user role and context
      let destination = '/';

      if (user && user.role === 'admin') {
        // Admin users go to admin dashboard
        destination = "/admin";
      } else {
        // For regular users, determine best redirect
        if (redirectTo && redirectTo !== '/admin' && redirectTo !== '/login') {
          // If there's a specific redirect (e.g., from protected route), use it
          destination = redirectTo;
        } else {
          // Check if user has items in cart using CartContext
          if (totalItems > 0) {
            // If user has items in cart, redirect to cart
            destination = "/cart";
          } else {
            // Otherwise, redirect to home page
            destination = "/";
          }
        }
      }

      router.push(destination);
    } catch (err) {
      setError("An error occurred");
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

  // Helper function to get redirect message for user
  const getRedirectMessage = () => {
    if (redirectTo && redirectTo !== '/' && redirectTo !== '/login') {
      return `After login, you'll be redirected to your requested page.`;
    }
    if (totalItems > 0) {
      return `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart. After login, you'll be redirected to your cart.`;
    }
    return `After login, you'll be redirected to the home page.`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-900">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!error && (
          <p className="text-gray-600 text-sm text-center mb-4">
            {getRedirectMessage()}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </button>
        </form>
        <div className="my-4 border-t text-center">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-red-900 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircularProgress size={32} className="text-red-900" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
