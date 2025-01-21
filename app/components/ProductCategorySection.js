"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { getBooksByCategory } from "@/utils/api";
import BookCard from "./BookCard";

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
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 30 },
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book._id}>
                <BookCard book={book} /> {/* Use the BookCard component */}
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
