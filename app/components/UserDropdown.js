"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaFileInvoice, FaShoppingBag, FaChevronDown, FaTachometerAlt } from "react-icons/fa";
import useAuthStore from "../../store/authStore";

const UserDropdown = ({ onLoginClick, variant = "dark" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isHydrated, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Loading skeleton
  if (!isMounted || !isHydrated) {
    return <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse"></div>;
  }

  // Logged out - show login button
  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${variant === "dark"
            ? "bg-white hover:bg-gray-50 text-red-800"
            : "bg-red-700 hover:bg-red-800 text-white"
          }`}
      >
        <FaUser className="text-xs" />
        <span>Login / Register</span>
      </button>
    );
  }

  // Logged in - show avatar with dropdown
  const initials = user.name
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-1 py-1 pr-3 rounded-full transition-all duration-200 cursor-pointer ${variant === "dark"
            ? "bg-white/10 hover:bg-white/20 border border-white/20"
            : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
          }`}
      >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${variant === "dark"
            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
            : "bg-gradient-to-br from-red-500 to-red-700 text-white"
          }`}>
          {initials}
        </div>
        {/* Name + Chevron */}
        <span className={`text-sm font-medium max-w-[100px] truncate hidden sm:inline ${variant === "dark" ? "text-white" : "text-gray-800"
          }`}>
          {user.name?.split(" ")[0]}
        </span>
        <FaChevronDown className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          } ${variant === "dark" ? "text-white/70" : "text-gray-500"}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email || "Customer"}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/invoices"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaFileInvoice className="text-gray-400 text-sm" />
              My Invoices
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaShoppingBag className="text-gray-400 text-sm" />
              My Orders
            </Link>

            {/* Admin Dashboard */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaTachometerAlt className="text-gray-400 text-sm" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="text-red-400 text-sm" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
