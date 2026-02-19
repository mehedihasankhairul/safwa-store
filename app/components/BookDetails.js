"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dummyBookCover from "../../public/assets/dummy.png";
import StickyCart from "./StickyCart";
import AddToCartButton from "./AddToCartButton";
import ProductCategorySection from "./ProductCategorySection";
import Footer from "./Footer";
import Navbar from "./NavBar";
import Header from "./Header";

const BookDetails = ({ book }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock data for recommended books
  const recommendedBooks = [
    { id: 1, title: "বইয়ের নাম", price: "৳ 340", discountedPrice: "৳ 350" },
    { id: 2, title: "অন্য বই", price: "৳ 295", discountedPrice: "৳ 320" },
    { id: 3, title: "আরেকটি বই", price: "৳ 280", discountedPrice: "৳ 300" },
  ];

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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Book Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-md shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Book Cover */}
                <div className="flex justify-center">
                  <Image
                    src={book.cover || dummyBookCover}
                    alt={book.title || "Book Cover"}
                    width={300}
                    height={400}
                    className="rounded-md shadow-lg"
                  />
                </div>

                {/* Book Details */}
                <div>
                  <h1 className="text-2xl font-bold text-red-900 mb-2">
                    {book.title}
                  </h1>
                  <p className="text-sm text-gray-700 mb-4">
                    <span className="text-blue-600">লেখক: {book.author || "Unknown"}</span> <br />
                    <span className="text-blue-600">প্রকাশনী: {book.publication || "Unknown"}</span> <br />
                    <span>বিষয়: {book.category || "Unknown"}</span> <br />
                    <span>সংস্করণ: ১ম, ৫ম প্রিন্ট, এপ্রিল ২০২৪</span>
                  </p>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {book.description || "আধুনিক যুগে ব্যক্তি ও জীবন আদর্শের বিভিন্ন প্রভাবে নিত্য পরিবর্তিত হয়ে চলেছে। প্রতিনিয়ত এমন সব বিষয় পরিবর্তিত হচ্ছে যা খুবই স্বাভাবিক। কিন্তু যেসব মৌলিক বিষয়ে পরিবর্তন আসছে তার মধ্যে মানুষের চিন্তাধারা, জীবনযাত্রার পদ্ধতি, আখলাক-চরিত্র ইত্যাদি অন্যতম। এ প্রসঙ্গে বলা যায়, বর্তমান যুগে প্রযুক্তির উন্নতি ও আধুনিকায়নের কারণে মানুষের মানবিক মূল্যবোধ অনেকটাই হ্রাস পেয়েছে। আর এ কারণেই আজকের বিশ্বে নৈতিক অবক্ষয় দেখা দিয়েছে।"}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="my-4">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold mb-2">
                      In Stock
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-red-600">
                        ৳ {book.salePrice}
                      </p>
                      {book.discount > 0 && (
                        <p className="text-lg text-gray-500 line-through">
                          ৳ {book.printedPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center my-4">
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none mr-4"
                    >
                      {[...Array(10).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </select>
                    <AddToCartButton item={book} quantity={quantity} />
                  </div>

                  {/* Wishlist */}
                  <div className="mt-4">
                    <button
                      onClick={() => alert("পছন্দের তালিকায় যুক্ত করা হয়েছে!")}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <span className="mr-2">♡</span>
                      পছন্দের তালিকায় যুক্ত করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Section */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">রিভিউ</h3>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your rating *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your review *
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                    placeholder="Write your review here..."
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your email address"
                  />
                </div>

                {/* Save Info Checkbox */}
                <div className="mb-4">
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="mr-2"
                    />
                    Save my name, email, and website in this browser for the next time I comment.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => {
                    if (!rating || !review || !email) {
                      alert("Please fill all required fields (*) and provide a rating.");
                      return;
                    }
                    alert("Thank you for your review! It has been submitted for approval.");
                    setRating(0);
                    setReview("");
                    setEmail("");
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">আরো পড়ুন...</h3>

              {/* Recommended Books */}
              <div className="space-y-4">
                {recommendedBooks.map((recBook) => (
                  <div key={recBook.id} className="flex gap-3 p-3 border rounded">
                    <Image
                      src={dummyBookCover}
                      alt={recBook.title}
                      width={60}
                      height={80}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">
                        {recBook.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        লেখক: অমুক তমুক
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-red-600">
                          {recBook.price}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {recBook.discountedPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default BookDetails;
