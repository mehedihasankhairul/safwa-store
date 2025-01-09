"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { getBooksByCategory } from "@/utils/api";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";

const ProductCategorySection = ({ category, title }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getBooksByCategory(category, { limit: 10 });
      setBooks(booksData);
    };
    fetchBooks();
  }, [category]);

  return (
    <section className="section product-category-section py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
        {books.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book._id}>
                <div className="relative p-2 bg-white shadow-md rounded-md border text-center max-h-[500] max-w-[250] ">
                  {/* Discount Badge */}
                  {book.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {book.discount}%
                    </div>
                  )}
                  {/* Book Cover */}
                  <Image
                    src={book.image || dummy}
                    alt={book.title}
                    height={60}
                    width={100}
                    className=" object-cover rounded-md w-full"
                  />
                  {/* Book Details */}
                  <div className="mt-4 ">
                    <h3 className="text-md text-nowrap hover:text-balance font-bold">{book.title}</h3>
                    <p className="text-sm  text-gray-600">লেখক: {book.author}</p>
                    <p className="text-sm text-gray-600">প্রকাশনায়: {book.publication || "Unknown"}</p>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="text-red-500 line-through mr-2">${book.printedPrice}</span>
                        <span className="text-green-600 font-bold">${book.salePrice || book.discountedPrice}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No books found in this category.</p>
        )}
      </div>
    </section>
  );
};

export default ProductCategorySection;
