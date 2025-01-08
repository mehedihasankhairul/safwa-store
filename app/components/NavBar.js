"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import AuthModal from "./AuthModal";


const Navbar = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      const userName = localStorage.getItem("userName"); // Store name separately
      setUser({ name: userName });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(null);
    alert("You have been logged out.");
  };

  const handleSearchBooks = (e) => {
    e.preventDefault();
    // log the search query
    console.log("Search Query: ", e.target.value);
  };
  //  handle search btn click
  const handleSearchBtn = (e) => {
    e.preventDefault();
    // log the search query
    console.log("Search Query: ", e.target.value);

  };





  return (
    <header className="bg-red-900 text-white">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-6 space-y-4 md:space-y-0">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image height={90} width={80} src={logo} alt="Logo" />
          <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">
            সাফওয়া স্টোর
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-grow flex px-4 items-center relative">
          <input
            onChange={handleSearchBooks}
            type="text"
            placeholder="বইয়ের নাম ও লেখক দিয়ে অনুসন্ধান করুন"
            className="w-full p-2 rounded-l-lg focus:outline-none text-black"
          />
          <button
            onClick={handleSearchBtn}
            className="bg-[#720000] text-white px-4 py-2 rounded-r-lg hover:bg-[#5a0000] transition-colors"
          >
            Search
          </button>
        </div>

        {/* User Options */}
        <div className="flex items-center space-x-4 bg-white text-red-900 px-4 py-2 rounded-sm">

          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="text-sm underline">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="text-sm underline">
              Login/Register
            </button>
          )}


          {/* Auth Modal For login/registration */}
          <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setUser={setUser} />


          <div className="relative">
            <button>
              <i className="fas fa-shopping-cart text-xl"></i>
            </button>
            <span className="absolute top-0 right-0 bg-white text-red-900 text-xs font-bold rounded-full px-2">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Navbar Links */}
      <nav className="bg-red-800">
        <ul className="flex flex-wrap justify-center items-center space-x-6 text-sm font-medium py-2">
          <li>
            <a href="/" className="hover:text-gray-300">
              হোম
            </a>
          </li>
          <li>
            <a href="/all-books" className="hover:text-gray-300">
              সকল বই
            </a>
          </li>
          <li className="relative group">
            <a href="/categories" className="hover:text-gray-300">
              বিষয় ভিত্তিক
            </a>
            {/* Dropdown */}
            <ul className="absolute hidden group-hover:block bg-red-800 text-white shadow-lg p-2 rounded-lg">
              <li>
                <a
                  href="/categories/quran-tafseer"
                  className="block hover:bg-gray-400 px-4 py-2 hover:text-gray-300"
                >
                  কুরআন ও তাফসীর
                </a>
              </li>
              <li>
                <a
                  href="/categories/al-hadith"
                  className="block hover:bg-gray-400 px-4 py-2 hover:text-gray-300"
                >
                  আল হাদিস
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/writers" className="hover:text-gray-300">
              লেখকগণ
            </a>
          </li>
          <li>
            <a href="/publications" className="hover:text-gray-300">
              প্রকাশনী
            </a>
          </li>
          <li>
            <a href="/packages" className="hover:text-gray-300">
              প্যাকেজ
            </a>
          </li>
          <li>
            <a href="/blog" className="hover:text-gray-300">
              ব্লগ
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
