"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TopSellingBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/top-selling-books`);
        const data = await res.json();
        setBooks(data.topBooks || []);
      } catch (error) {
        console.error("Failed to fetch top-selling books:", error);
      }
    };

    fetchTopBooks();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Top-Selling Books
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.bookDetails.title}</TableCell>
                <TableCell>{book.totalQuantitySold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
