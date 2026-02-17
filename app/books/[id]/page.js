"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Or `useRouter` in older Next.js versions
import { getBookById } from "@/utils/api";
import BookDetails from "../../components/BookDetails";
import ProductCategorySection from "@/app/components/ProductCategorySection";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";


const BookPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(id);
        if (data) {
          setBook(data);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        setError("Failed to load book details");
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading book details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Book not found state
  if (!book) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
              <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
              <a
                href="/books"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition inline-block"
              >
                Browse Books
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <Header />
      <BookDetails book={book} />
      {/* Related Books Slider Section - Bottom of page */}
      <div className="container mx-auto px-4 mb-8">
        <ProductCategorySection title="বিষয়ভিত্তিক বই" category={book.category || ""} />
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default BookPage;
