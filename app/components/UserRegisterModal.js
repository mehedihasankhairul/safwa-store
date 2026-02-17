"use client";

import { useState } from "react";
import { CircularProgress } from "@mui/material";
import useAuthStore from "../../store/authStore";

const UserRegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Use separate selectors to avoid selector recreation issues
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting registration
    setSuccess("");
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      const { success, error, message } = await register(name, email, password, "user");
      if (!success) {
        setError(error || "Registration failed");
        return;
      }
      
      setSuccess(message || "Registration successful! You can now sign in.");
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Switch to login modal after a brief delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative max-h-[90vh] overflow-y-auto">
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
          <h2 className="text-2xl font-bold text-red-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us to start shopping</p>
        </div>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              placeholder="Enter your full name"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="modal-reg-email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="modal-reg-email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="modal-reg-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="modal-reg-password"
              name="password"
              placeholder="Create a password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="modal-confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="modal-confirm-password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-red-900 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterModal;
