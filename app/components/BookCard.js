"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dummy from "../../public/assets/dummy.png";
import useCartStore from "@/store/cartStore"; // Import the Zustand store

const BookCard = ({ book }) => {
  const addToCart = useCartStore((state) => state.addToCart); // Access the addToCart method from Zustand

  return (
    <Link href={`/books/${book._id}`} passHref>
      <div
        className="relative mt-5 bg-white shadow-md rounded-md border text-center hover:shadow-lg transition duration-300 flex flex-col items-center group w-full max-w-[220px] mx-auto h-[400px] overflow-hidden cursor-pointer"
      >
        {/* Discount Badge */}
        {book.discount > 0 && (
          <div className="absolute top-0 left-2 bg-red-800 text-white text-xs font-extralight px-3 py-2 rounded-full">
            {book.discount}%
            <br />
            ছাড়
          </div>
        )}

        {/* Book Cover */}
        <div className="w-full h-[220px] flex items-center justify-center relative overflow-hidden">
          <Image
            src={ book.coverImgs[0]  || dummy}
            alt={book.title}
            fill
            className="object-cover rounded-md pt-2"
            style={{ objectFit: "contain" }}
          />

          {/* Add to Cart Button */}
          <button
            className="absolute bottom-0 left-0 right-0 bg-red-700 text-white text-sm font-bold py-2 opacity-0 group-hover:opacity-100 transition duration-300"
            onClick={() => addToCart(book)}
          >
            Add to Cart
          </button>
        </div>
        {/* Add to Cart Button */}
       

        {/* Book Details */}
        <div className="mt-4 flex flex-col flex-grow justify-between px-4 pb-4 w-full">
          <h3 className="text-sm font-bold line-clamp-2 break-words w-full">
            {book.title}
          </h3>
          <p className="text-xs text-gray-600 truncate w-full">লেখক: {book.author}</p>
          <p className="text-xs text-gray-600 truncate w-full">
            প্রকাশনায়: {book.publication || "Unknown"}
          </p>
          <div className="mt-2 w-full">
            <p className="text-sm truncate">
              <span className="text-red-500 line-through mr-2">
                ৳ {book.printedPrice}
              </span>
              {/* Sale Price */}
              <span className="text-green-600 text-md font-bold">
                ৳ {book.salePrice || book.discountedPrice}
              </span>
            </p>
          </div>
        </div>

       
      </div>
    </Link>
  );
};

export default BookCard;
