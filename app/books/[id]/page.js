"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Or `useRouter` in older Next.js versions
import { getBookById } from "@/utils/api";
import BookDetails from "../../components/BookDetails";

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookById(id);
        setBook(bookData);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  return <>
    <BookDetails book={book} />;
  </>
};

export default BookPage;
