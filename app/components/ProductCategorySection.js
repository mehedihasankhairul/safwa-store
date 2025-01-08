"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import { getBooksByCategory } from "@/utils/api";

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
                <div className="p-4 bg-white shadow-md rounded-md border text-center">
                  <img
                    src={book.image || "/default-book.jpg"}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-bold mt-4">{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Price: ${book.price}</p>
                  <p>Discount: {book.discount}%</p>
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
