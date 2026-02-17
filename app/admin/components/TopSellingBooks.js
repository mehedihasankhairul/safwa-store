"use client";
import { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, CircularProgress, Box, Chip, Avatar
} from "@mui/material";
import { EmojiEvents, MenuBook } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

export default function TopSellingBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const authToken = token || localStorage.getItem("token");
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        // Fetch analytics data
        const analyticsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/sales`, {
          method: "GET",
          headers,
        });

        if (!analyticsRes.ok) {
          throw new Error(`API Error: ${analyticsRes.status}`);
        }

        const analyticsData = await analyticsRes.json();

        // Also fetch books with revenue sorting as fallback
        const booksRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books?sortBy=revenue&order=desc`, {
          method: "GET",
          headers,
        });

        let topBooks = analyticsData.topBooks || [];

        // If no top books from analytics, use books with highest revenue
        if (topBooks.length === 0 && booksRes.ok) {
          const booksData = await booksRes.json();
          topBooks = booksData.books
            ?.filter(book => book.revenue && book.revenue > 0)
            .slice(0, 5)
            .map(book => ({
              _id: book._id,
              title: book.title,
              totalSold: Math.ceil(book.revenue / book.salePrice) || 1,
              revenue: book.revenue
            })) || [];
        }

        setBooks(topBooks);
      } catch (error) {
        console.error("Failed to fetch top-selling books:", error);
        setError(error.message);
        setUsingMockData(true);
        // Set mock data for display
        setBooks([
          { _id: '1', title: 'উমরাহ সফরের গল্প', totalSold: 12, revenue: 2772 },
          { _id: '2', title: 'প্যারাডক্সিক্যাল সাজিদ ২', totalSold: 8, revenue: 992 },
          { _id: '3', title: 'স্বালাতে মুবাশশির (ﷺ)', totalSold: 6, revenue: 528 },
          { _id: '4', title: 'ফিলিস্তিন', totalSold: 5, revenue: 675 },
          { _id: '5', title: 'শতভাগ বিশুদ্ধ মধু', totalSold: 4, revenue: 1200 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, [token]);

  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <Card sx={{ borderRadius: 3, height: "100%", overflow: "hidden" }}>
      {/* Gradient header strip */}
      <Box sx={{ height: 4, background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEvents sx={{ color: "#FFD700" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              Top Sellers
            </Typography>
          </Box>
          {usingMockData && (
            <Chip label="Sample Data" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.7rem" }} />
          )}
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && books.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>Book</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>Sold</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book, index) => (
                <TableRow key={book._id} sx={{ "&:last-child td": { border: 0 }, "&:hover": { bgcolor: "#f8f9fa" } }}>
                  <TableCell sx={{ border: "none", py: 1.5 }}>
                    {index < 3 ? (
                      <Avatar sx={{ width: 28, height: 28, bgcolor: medalColors[index], fontSize: "0.75rem", fontWeight: 700 }}>
                        {index + 1}
                      </Avatar>
                    ) : (
                      <Typography variant="body2" sx={{ pl: 0.5, color: "#999" }}>{index + 1}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ border: "none", py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#333", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ border: "none", py: 1.5 }}>
                    <Chip label={book.totalSold} size="small" sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600, fontSize: "0.75rem" }} />
                  </TableCell>
                  <TableCell align="right" sx={{ border: "none", py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a2e" }}>
                      ৳{book.revenue?.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          !loading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <MenuBook sx={{ fontSize: 48, color: "#ddd", mb: 1 }} />
              <Typography color="text.secondary">No sales data available</Typography>
            </Box>
          )
        )}
      </CardContent>
    </Card>
  );
}
