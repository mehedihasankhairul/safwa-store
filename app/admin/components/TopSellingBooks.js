"use client";
import { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, CircularProgress, Box
} from "@mui/material";

export default function TopSellingBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        console.log("Fetching top-selling books...");

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/sales`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        console.log("✅ Top Books Response:", data);

        setBooks(data.topBooks || []);
      } catch (error) {
        console.error("❌ Failed to fetch top-selling books:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  return (
    <Card sx={{ margin: 3, padding: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          📚 Top-Selling Books
        </Typography>

        {/* ✅ Show Loading Indicator */}
        {loading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        {/* ✅ Show Error Message */}
        {error && (
          <Typography color="error" textAlign="center">
            ⚠️ {error}
          </Typography>
        )}

        {/* ✅ Show Top Selling Books Table */}
        {!loading && !error && books.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Sold</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Revenue (৳)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell align="center">{book.totalSold}</TableCell>
                  <TableCell align="center">৳ {book.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !loading && <Typography textAlign="center">No data available.</Typography>
        )}
      </CardContent>
    </Card>
  );
}
