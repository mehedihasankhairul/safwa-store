"use client";
import React, { useState } from "react";
import Image from "next/image";
import dummyBookCover from "../../public/assets/dummy.png";
import Header from "./Header";
import AddToCartButton from "./AddToCartButton";
import StickyCart from "./StickyCart";

const BookDetails = ({ book }) => {
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-bold text-gray-600">Loading book details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-1/2 right-0 transform translate-y-1/2 z-50">
       
        <StickyCart />
      </div>
      <Header title={book.title} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Book Cover */}
          <div className="flex justify-center">
            <Image
              src={book.cover || dummyBookCover}
              alt={book.title || "Book Cover"}
              width={300}
              height={400}
              className="rounded-md shadow-md"
            />
          </div>

          {/* Book Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-gray-600 mt-2">
              <strong>Author:</strong> {book.author || "Unknown"}
            </p>
            <p className="text-gray-600">
              <strong>Category:</strong> {book.category || "Unknown"}
            </p>
            <p className="text-gray-600">
              <strong>Publisher:</strong> {book.publication || "Unknown"}
            </p>

            {/* Pricing */}
            <div className="mt-4">
              <p className="text-lg font-bold text-red-600">
                ৳ {book.salePrice}
              </p>
              {book.discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  ৳ {book.printedPrice}
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-4">
              <label htmlFor="quantity" className="block text-sm text-gray-600">
                Quantity:
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none"
                >
                  {[...Array(10).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>

              </div>

              <AddToCartButton item={book} />

            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800">Description</h2>
          <p className="mt-4 text-gray-600">
            {book.description || "No description available for this book."}
          </p>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
