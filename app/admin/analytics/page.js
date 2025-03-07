"use client";
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/sales`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json();
        
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        <Typography variant="h6">⚠️ Failed to fetch analytics</Typography>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* ✅ Daily Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">📅 Todays Sales</Typography>
            <Typography variant="h4" color="primary">৳ {analytics?.daily?.totalSales || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Orders: {analytics?.daily?.totalOrders || 0} | Growth: {analytics?.daily?.growth || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ✅ Weekly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">📆 This Week</Typography>
            <Typography variant="h4" color="primary">৳ {analytics?.weekly?.totalSales || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Orders: {analytics?.weekly?.totalOrders || 0} | Growth: {analytics?.weekly?.growth || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ✅ Monthly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">📊 This Month</Typography>
            <Typography variant="h4" color="primary">৳ {analytics?.monthly?.totalSales || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Orders: {analytics?.monthly?.totalOrders || 0} | Growth: {analytics?.monthly?.growth || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* ✅ Yearly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">📅 Yearly Sales</Typography>
            <Typography variant="h4" color="primary">৳ {analytics?.yearly?.totalSales || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Orders: {analytics?.yearly?.totalOrders || 0} | Growth: {analytics?.yearly?.growth || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;
