"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "@/utils/api";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const data = await getAllBooks(pagination);
      if (data) {
        setBooks(data.books);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalBooks: data.totalBooks,
        }));
      }
      setLoading(false);
    };
    fetchBooks();
  }, [pagination.page]);

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="p-4 bg-white shadow-md rounded-md border"
              >
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Price: ${book.price}</p>
                <p>Category: {book.category}</p>
                <p>Discount: {book.discount}%</p>
                <p>Stock: {book.stock}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;
