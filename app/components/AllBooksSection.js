import React, { useEffect, useState } from "react";
import { getAllBooksForAllSection } from "@/utils/api";

const AllBooksSection = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const allBooks = await getAllBooksForAllSection();
      setBooks(allBooks);
    };
    fetchBooks();
  }, []);

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-6">সকল বই</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="p-4 bg-white shadow-md rounded-md">
              <img
                src={book.image || "/default-book.jpg"}
                alt={book.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-bold mt-4">{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Price: {book.discountedPrice} ৳</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBooksSection;
