"use client";
import { Grid, Card, CardContent, Typography, Box, Button, Avatar, Chip } from "@mui/material";
import Link from "next/link";
import { Home, MenuBook, ShoppingCart, Receipt, BarChart, ArrowForward } from "@mui/icons-material";
import DashboardCards from "./components/DashboardCards";
import OrdersTable from "./components/OrdersTable";
import TopSellingBooks from "./components/TopSellingBooks";
import SalesChart from "./components/SalesChart";
import useAuthStore from "../../store/authStore";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const quickLinks = [
  { href: "/admin/books", label: "Books", icon: <MenuBook />, gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart />, gradient: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)" },
  { href: "/admin/invoices", label: "Invoices", icon: <Receipt />, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart />, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Section */}
      <Box sx={{
        mb: 3,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <Box sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(102, 126, 234, 0.15)",
        }} />
        <Box sx={{
          position: "absolute",
          bottom: -60,
          right: 80,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(118, 75, 162, 0.1)",
        }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <Box>
            <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", mb: 0.5, fontWeight: 500 }}>
              {getGreeting()} 👋
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: "1.5rem", md: "2rem" } }}>
              Welcome back, {user?.name?.split(" ")[0] || "Admin"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              Here&apos;s what&apos;s happening with your store today.
            </Typography>
          </Box>

          <Link href="/">
            <Button
              variant="contained"
              startIcon={<Home />}
              sx={{
                textTransform: "none",
                borderRadius: 2.5,
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                px: 3,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                display: { xs: "none", md: "flex" }
              }}
            >
              Visit Store
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Quick Links */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickLinks.map((item) => (
          <Grid item xs={6} sm={3} key={item.label}>
            <Link href={item.href} style={{ textDecoration: "none" }}>
              <Card sx={{
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
                overflow: "hidden"
              }}>
                <Box sx={{ height: 3, background: item.gradient }} />
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2, px: 2.5 }}>
                  <Avatar sx={{
                    width: 40, height: 40,
                    background: item.gradient,
                    "& svg": { fontSize: "1.2rem" }
                  }}>
                    {item.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.9rem" }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <ArrowForward sx={{ fontSize: "1rem", color: "#ccc" }} />
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Dashboard Stats Cards */}
      <DashboardCards />

      {/* Analytics Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <SalesChart />
        </Grid>
        <Grid item xs={12} md={5}>
          <TopSellingBooks />
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ height: 4, background: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)" }} />
        <CardContent sx={{ p: 3 }}>
          <OrdersTable />
        </CardContent>
      </Card>
    </Box>
  );
}
