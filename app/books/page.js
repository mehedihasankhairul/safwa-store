"use client";

import React, { useEffect, useState } from "react";
import { getAllBooksForAllSection } from "@/utils/api";
import Navbar from "../components/NavBar";

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

      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold mb-6">সকল বই</h2>
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id} className="p-4 bg-white shadow-md rounded-md">
                  <img
                    src={book.coverImg || "/default-book.jpg"}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-bold mt-4">{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Publisher: {book.publication}</p>
                  <p className="line-through text-red-500">
                    Printed Price: {book.printedPrice} ৳
                  </p>
                  <p>Sale Price: {book.salePrice} ৳</p>
                  <p className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md inline-block">
                    {book.discount}% Off
                  </p>
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
