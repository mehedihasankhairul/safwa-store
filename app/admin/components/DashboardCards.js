"use client";
import { useState, useEffect, useMemo } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { TrendingUp, TrendingDown, Book, ShoppingCart, AttachMoney, Warning } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

const DashboardCards = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        // Fetch books count
        const booksRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books`);
        const booksData = await booksRes.json();

        // Fetch orders data
        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
          headers
        });
        const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };

        // Calculate stats
        const totalBooks = booksData.books?.length || booksData.totalBooks || 0;
        const totalOrders = ordersData.orders?.length || 0;
        const totalRevenue = ordersData.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;
        const lowStockBooks = booksData.books?.filter(book => book.stock < 5).length || 0;

        setStats({
          totalBooks,
          totalOrders,
          totalRevenue,
          lowStockBooks
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  const cardData = useMemo(() => [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: <Book sx={{ fontSize: 36, opacity: 0.9 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      lightBg: "#f0ecff"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 36, opacity: 0.9 }} />,
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      lightBg: "#e6fff2"
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 36, opacity: 0.9 }} />,
      gradient: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
      lightBg: "#fff0f3"
    },
    {
      title: "Low Stock",
      value: stats.lowStockBooks,
      icon: <Warning sx={{ fontSize: 36, opacity: 0.9 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      lightBg: "#fff0f5",
      alert: stats.lowStockBooks > 0
    }
  ], [stats]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.12)"
            }
          }}>
            {/* Gradient Top Strip */}
            <Box sx={{ height: 4, background: card.gradient }} />
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#888", fontWeight: 500, mb: 0.5, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  background: card.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
