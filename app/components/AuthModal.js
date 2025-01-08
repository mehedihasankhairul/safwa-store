"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const BASE_URL = "https://bookshop-management-backend.onrender.com/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

      const response = await axios.post(`${BASE_URL}${endpoint}`, payload);

      if (response.status === 200) {
        if (isLogin) {
          const { token, user } = response.data;

          // Save token and user details to localStorage
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user)); // Store user details


          setUser({ name: user.name, role: user.role }); // Update user state

          // Redirect based on user role
          if (user.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/cart"); // Redirect to cart or homepage for regular users
          }

          onClose(); // Close modal
        } else {
          alert(response.data.message); // Display signup success message
          setIsLogin(true); // Switch to login view after registration
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Tabs */}
        <div className="flex justify-center border-b pb-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 ${isLogin ? "text-red-900 border-b-2 border-red-900" : "text-gray-500"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 ${!isLogin ? "text-red-900 border-b-2 border-red-900" : "text-gray-500"
              }`}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required={!isLogin}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-sm text-red-900 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${loading ? "bg-gray-400" : "bg-red-900"
              } text-white py-2 px-4 rounded-lg hover:bg-red-700`}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Log in" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
