"use client";

import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Prevents execution during SSR

    const fetchSales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/sales`);
        const data = await res.json();
        setSalesData(data);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      {/* Daily Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Todays Sales</Typography>
            <Typography variant="h4">৳ {salesData?.dailySales || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">This Week</Typography>
            <Typography variant="h4">৳ {salesData?.weeklySales || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">This Month</Typography>
            <Typography variant="h4">৳ {salesData?.monthlySales || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Yearly Sales */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">This Year</Typography>
            <Typography variant="h4">৳ {salesData?.yearlySales || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
