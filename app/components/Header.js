"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import mainLogo from '../../public/assets/logo.png';
import Link from 'next/link';
import useAuthStore from '../../store/authStore';
import { FaBars, FaTimes } from 'react-icons/fa';
import UserDropdown from './UserDropdown';


const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between bg-red-700 text-white p-4 relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={mainLogo} height={20} width={40} alt="Logo" className="h-8 md:h-10" />
          <h1 className="text-lg md:text-2xl font-bold whitespace-nowrap">Safwa Store</h1>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="hidden md:flex gap-3 lg:gap-4 items-center">
          <Link href="/" className="hover:underline">Home</Link>
          <a href="#" className="hover:underline">Categories</a>
          <a href="#" className="hover:underline">Best Sellers</a>
          <a href="#" className="hover:underline">Contact</a>

        </nav>

        {/* Desktop Search & Login - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <input
            type="text"
            placeholder="Search for books..."
            className="px-2 py-1 rounded text-black text-sm w-32 lg:w-48"
          />
          <UserDropdown variant="dark" />
        </div>

        {/* Mobile Hamburger Button - Visible only on Mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-red-700 text-white absolute top-16 left-0 right-0 z-50 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/"
              className="hover:bg-red-800 p-2 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#"
              className="hover:bg-red-800 p-2 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </a>
            <a
              href="#"
              className="hover:bg-red-800 p-2 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Best Sellers
            </a>
            <a
              href="#"
              className="hover:bg-red-800 p-2 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>


            {/* Mobile Search */}
            <div className="pt-2 border-t border-red-600">
              <input
                type="text"
                placeholder="Search for books..."
                className="w-full px-3 py-2 rounded text-black"
              />
            </div>

            {/* Mobile User Section */}
            <div className="pt-2 border-t border-red-600">
              <UserDropdown variant="dark" />
            </div>
          </nav>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};


export default Header