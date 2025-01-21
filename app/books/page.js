"use client";

import React, { useEffect, useState } from "react";
import { getAllBooksForAllSection } from "@/utils/api";
import Navbar from "../components/NavBar";
import BookCard from "../components/BookCard";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const allBooks = await getAllBooksForAllSection();
      setBooks(allBooks);
    };
    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />

      <section className="my-8">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold mb-6">সকল বই</h2>
          {books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {books.map((book) => (
                <div key={book._id} className=" bg-white">
                 <BookCard book={book} />
                </div>
              ))}
            </div>
          ) : (
            <p>No books found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default AllBooksPage;
