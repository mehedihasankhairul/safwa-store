"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import defaultImg from "../../public/assets/dummy.png";
import UserLoginModal from "./UserLoginModal";
import UserRegisterModal from "./UserRegisterModal";
import { useRouter } from "next/navigation";
import { getAllBooks } from "@/utils/api"; // Import API function for search
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import useCartStore, { hydrateCartStore } from "../../store/cartStore"; // Import Zustand store
import useAuthStore from "../../store/authStore"; // Import Auth store
import CartPage from "./CartPage"; // Import the CartPage component
import UserDropdown from "./UserDropdown";
import Link from "next/link";

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Use Zustand auth store
  const { user, isHydrated, logout } = useAuthStore();

  console.log("user state from auth store:", user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for cart drawer
  const { cartItems } = useCartStore();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();


  useEffect(() => {
    setIsMounted(true);

    // Hydrate cart store
    hydrateCartStore();
  }, []);

  const handleLogout = () => {
    logout(); // Use auth store logout
    alert("You have been logged out.");
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await getAllBooks({ search: query.trim() });
      setSearchResults(response.books || []);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error("Error searching books:", error);
      setIsDropdownVisible(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownVisible(false);
    }
  };

  return (
    <header className="bg-red-900 text-white">
      {/* Top Navigation Bar */}
      <div className="bg-red-950/40 border-b border-red-800/30">
        <div className="container mx-auto px-6 py-2">
          <nav className="flex items-center gap-6 text-xs md:text-sm font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <Link href="/books" className="hover:text-amber-400 transition-colors">All books</Link>
            <Link href="/" className="hover:text-amber-400 transition-colors">Support</Link>
            <Link href="/" className="hover:text-amber-400 transition-colors">Request Books</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Image height={90} width={80} src={logo} alt="Logo" />
          <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">
            সাফওয়া স্টোর
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-grow flex px-4 items-center relative">
          <form className="w-full flex" onSubmit={handleSearchSubmit}>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              type="text"
              placeholder="বইয়ের নাম ও লেখক দিয়ে অনুসন্ধান করুন"
              className="w-full p-2 rounded-l-lg focus:outline-none text-black"
            />
            <button
              type="submit"
              className="bg-[#720000] text-white px-4 py-2 rounded-r-lg hover:bg-[#5a0000] transition-colors"
            >
              Search
            </button>
          </form>

          {isDropdownVisible && searchQuery && (
            <div className="absolute top-full left-0 bg-white text-black w-full mt-1 rounded-md shadow-md z-10">
              {searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div
                    key={book._id}
                    className="p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      router.push(`/books/${book._id}`);
                      setIsDropdownVisible(false);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={book.image || defaultImg}
                        alt={book.title}
                        width={50}
                        height={75}
                        className="rounded-md object-cover"
                      />
                      <div className="text-left">
                        <h3 className="text-sm font-bold">{book.title}</h3>
                        <p className="text-xs text-gray-600">{book.author}</p>
                        <p className="text-xs text-gray-600">{book.publication}</p>
                      </div>
                    </div>
                    <div className="text-md font-bold text-gray-800">
                      {book.discountedPrice || book.printedPrice} ৳
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-center">No results found</div>
              )}
            </div>
          )}
        </div>


        <div className="flex items-center space-x-3">
          {/* User Dropdown */}
          <UserDropdown
            onLoginClick={() => setIsLoginModalOpen(true)}
            variant="dark"
          />

          {/* User Login Modal */}
          <UserLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
          />

          {/* User Register Modal */}
          <UserRegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onSwitchToLogin={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />

          <div className="relative">
            <button onClick={() => setIsCartOpen(!isCartOpen)}>
              <FaShoppingCart className="text-md" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <FaTimes className="text-xl" />

        </button>

        {/* Cart Content */}
        <CartPage />
      </div>

      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </header>
  );
};

export default Navbar;
