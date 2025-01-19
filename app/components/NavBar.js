"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../public/assets/logo.png";
import defaultImg from "../../public/assets/dummy.png";
import AuthModal from "./AuthModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBooks } from "@/utils/api"; // Import API function for search

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

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

  const handleSearchChange = async (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query === "") {
      setSearchResults([]);
      setIsDropdownVisible(false); // Close the dropdown when the search query is empty
      return;
    }

    try {
      // Fetch books matching the search query
      const response = await getAllBooks({ search: query });
      setSearchResults(response.books || []);
      setIsDropdownVisible(true); // Show the dropdown if there are results
    } catch (error) {
      console.error("Error searching books:", error);
      setIsDropdownVisible(false); // Close the dropdown in case of an error
    }
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
      setIsDropdownVisible(false);
    }
  };

  return (
    <header className="bg-red-900 text-white">
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

          {/* Dropdown for search results */}
          {/* Dropdown for search results */}
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
                    {/* Left Section */}
                    <div className="flex items-center space-x-4">
                      {console.log(book)}
                      <Image
                        src={book.image || defaultImg}
                        alt={book.title}
                        width={50}
                        height={75}
                        className="rounded-md object-cover"
                      />
                      <div className=" text-left">
                        <h3 className="text-sm font-bold">{book.title}</h3>
                        <p className="text-xs text-gray-600">{book.author}</p>
                        <p className="text-xs text-gray-600">{book.publication}</p>

                      </div>
                    </div>

                    {/* Right Section */}
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


        <div className="flex items-center space-x-4 bg-white text-red-900 px-4 py-2 rounded-sm">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="text-sm underline">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm underline"
            >
              Login/Register
            </button>
          )}

          <AuthModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            setUser={setUser}
          />

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

      <nav className="bg-red-800">
        <ul className="flex flex-wrap justify-center items-center space-x-6 text-sm font-medium py-2">
          <li>
            <Link href="/" className="hover:text-gray-300">
              হোম
            </Link>
          </li>
          <li>
            <Link href="/books" className="hover:text-gray-300">
              সকল বই
            </Link>
          </li>
          <li className="relative group">
            <a href="/categories" className="hover:text-gray-300">
              বিষয় ভিত্তিক
            </a>
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
