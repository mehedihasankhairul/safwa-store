"use client";
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import useAnalyticsStore from "@/store/useAnalyticsStore";

export default function SalesAnalytics() {
  const { analyticsData, fetchAllAnalytics, loading } = useAnalyticsStore();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );

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
                <Typography variant="body2">Type: daily</Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ৳ {analyticsData.daily.toLocaleString()}
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
                <Typography variant="body2">Type: weekly</Typography>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  ৳ {analyticsData.weekly.toLocaleString()}
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
                <Typography variant="body2">Type: monthly</Typography>
                <Typography variant="h4" color="success" fontWeight="bold">
                  ৳ {analyticsData.monthly.toLocaleString()}
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
                <Typography variant="body2">Type: yearly</Typography>
                <Typography variant="h4" color="warning" fontWeight="bold">
                  ৳ {analyticsData.yearly.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
