"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Or `useRouter` in older Next.js versions
import { getBookById } from "@/utils/api";
import BookDetails from "../../components/BookDetails";


const BookPage = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  useEffect(() => {
    getBookById(id).then((data) => setBook(data));
  }
    , [id]);

  return <div className=" ">
    <BookDetails book={book} />;
  </div>
};

export default BookPage;
