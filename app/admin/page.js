"use client";
import { Grid, Card, CardContent, Typography, Button, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import { AnalyticsSharp, BookSharp } from "@mui/icons-material";
import { FaFileInvoiceDollar, FaFirstOrder } from "react-icons/fa";
import { styled } from "@mui/system";

// Styled Card with hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
    
  },
}));

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return (
    <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Section */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome, {user?.name || "Admin"}!
                  </Typography>
                  <Link href="/">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<HomeIcon />}
                      sx={{ textTransform: "none" }}
                      aria-label="Go to Home"
                    >
                      Home
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Navigation Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3} justifyContent="center">
            {[
              { href: "/admin/books", label: "Books Inventory", icon: <BookSharp />, color: "success" },
              { href: "/admin/orders", label: "Orders", icon: <FaFirstOrder />, color: "warning" },
              { href: "/admin/invoices", label: "Invoices", icon: <FaFileInvoiceDollar />, color: "info" },
              { href: "/admin/analytics", label: "Analytics", icon: <AnalyticsSharp />, color: "primary" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledCard>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Link href={item.href} passHref>
                      <Button
                        variant="contained"
                        color={item.color}
                        startIcon={item.icon}
                        fullWidth
                        sx={{ textTransform: "none", padding: "10px 0" }}
                        aria-label={`Go to ${item.label}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}