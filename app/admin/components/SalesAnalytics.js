"use client";
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import useAuthStore from "../../../store/authStore";

// ✅ Helper Function to Format Numbers
const formatNumber = (num) => (typeof num === "number" ? num.toLocaleString() : "0");

// ✅ Color Mappings for Growth
const getGrowthColor = (growth) => {
  const value = Number(growth);
  if (value > 0) return "success.main"; // Green for growth
  if (value < 0) return "error.main"; // Red for decline
  return "text.secondary"; // Gray for no change
};

export default function SalesAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  // ✅ Fetch Analytics Data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/sales`, {
          method: "GET",
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  // ✅ Loading State
  if (loading || !analyticsData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  // ✅ Error Handling
  if (error) {
    return (
      <Box textAlign="center" color="error.main" mt={3}>
        <Typography variant="h6">⚠️ Failed to load analytics data</Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ padding: 3, margin: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          📊 Sales Analytics Overview
        </Typography>

        <Grid container spacing={3}>
          {/* ✅ Daily Sales */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ backgroundColor: "#E3F2FD" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Daily Sales
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ৳ {formatNumber(analyticsData?.daily?.totalSales)}
                </Typography>
                <Typography variant="body2" color={getGrowthColor(analyticsData?.daily?.growth)}>
                  Growth: {formatNumber(analyticsData?.daily?.growth)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ✅ Weekly Sales */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ backgroundColor: "#FBE9E7" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="secondary">
                  Weekly Sales
                </Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  ৳ {formatNumber(analyticsData?.weekly?.totalSales)}
                </Typography>
                <Typography variant="body2" color={getGrowthColor(analyticsData?.weekly?.growth)}>
                  Growth: {formatNumber(analyticsData?.weekly?.growth)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ✅ Monthly Sales */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ backgroundColor: "#E8F5E9" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="success">
                  Monthly Sales
                </Typography>
                <Typography variant="h4" color="success" fontWeight="bold">
                  ৳ {formatNumber(analyticsData?.monthly?.totalSales)}
                </Typography>
                <Typography variant="body2" color={getGrowthColor(analyticsData?.monthly?.growth)}>
                  Growth: {formatNumber(analyticsData?.monthly?.growth)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* ✅ Yearly Sales */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ backgroundColor: "#FFF3E0" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="warning">
                  Yearly Sales
                </Typography>
                <Typography variant="h4" color="warning" fontWeight="bold">
                  ৳ {formatNumber(analyticsData?.yearly?.totalSales)}
                </Typography>
                <Typography variant="body2" color={getGrowthColor(analyticsData?.yearly?.growth)}>
                  Growth: {formatNumber(analyticsData?.yearly?.growth)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
