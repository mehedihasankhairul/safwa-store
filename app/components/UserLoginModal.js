"use client";

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import useAuthStore from "../../store/authStore";
import { useCart } from "../../context/CartContext";

const UserLoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Use separate selectors to avoid selector recreation issues
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  // Get cart information from CartContext
  const { totalItems } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting login

    try {
      const { success, error, user } = await login(email, password);
      if (!success) {
        setError(error || "Login failed");
        return;
      }

      // For regular users (non-admin), close modal and stay on current page
      if (user && user.role !== 'admin') {
        onClose();
        // You can add success notification here if needed
      } else if (user && user.role === 'admin') {
        // If admin logs in through user modal, redirect to admin panel
        window.location.href = '/admin';
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-red-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="modal-email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="modal-password"
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-red-900 font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginModal;
