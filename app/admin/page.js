"use client";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import SalesAnalytics from "./components/SalesAnalytics";
import SalesChart from "./components/SalesChart";
import TopSellingBooks from "./components/TopSellingBooks";

export default function AdminDashboard() {
  return (
    <Grid container spacing={3}>
      {/* Sales Analytics */}
      <Grid item xs={12} md={12}>
        <SalesAnalytics />
      </Grid>

      {/* Sales Chart */}
      <Grid item xs={12} md={6}>
        <SalesChart />
      </Grid>

      {/* Top Selling Books */}
      <Grid item xs={12} md={6}>
        <TopSellingBooks />
      </Grid>
    </Grid>
     
  );
}
