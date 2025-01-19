"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";
import { getAllBooksForSearch } from "@/utils/api";

const Search = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  // Fetch books based on search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setResults([]);
        return;
      }
      const books = await getAllBooksForSearch({ query: searchQuery });
      setResults(books);
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50">
      <div className="p-4">
        {/* Search Input */}
        <div className="relative flex items-center mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বইয়ের নাম, লেখক বা বিষয় দিয়ে অনুসন্ধান করুন"
            className="w-full p-2 border rounded-lg focus:outline-none text-black"
          />
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 text-gray-400 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((book) => (
              <li
                key={book._id}
                className="flex items-center space-x-4 border p-2 rounded-lg"
              >
                {/* Book Cover */}
                <Image
                  src={book.coverImg || dummy}
                  alt={book.title}
                  width={60}
                  height={80}
                  className="rounded-lg"
                />
                {/* Book Details */}
                <div className="flex-grow">
                  <h4 className="text-lg font-bold">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-600">
                    মূল্য: {book.discountedPrice || book.printedPrice}৳
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
