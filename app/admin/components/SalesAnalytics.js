"use client";
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress, Box, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, CalendarToday, DateRange, CalendarMonth, EventNote, ShoppingCart, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

const formatCurrency = (num) => `৳${(typeof num === "number" ? num : 0).toLocaleString()}`;
const formatGrowth = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

const periodConfig = [
  {
    key: "daily",
    label: "Daily Sales",
    icon: <CalendarToday sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    key: "weekly",
    label: "Weekly Sales",
    icon: <DateRange sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    key: "monthly",
    label: "Monthly Sales",
    icon: <CalendarMonth sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
  },
  {
    key: "yearly",
    label: "Yearly Sales",
    icon: <EventNote sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
];

export default function SalesAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

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

  if (loading || !analyticsData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" color="error.main" mt={3}>
        <Typography variant="h6">⚠️ Failed to load analytics data</Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ height: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e", textAlign: "center", mb: 3 }}>
          📊 Sales Analytics Overview
        </Typography>

        <Grid container spacing={2.5}>
          {periodConfig.map((period) => {
            const data = analyticsData?.[period.key] || {};
            const growth = parseFloat(data.growth);
            const isPositive = growth > 0;
            const isNegative = growth < 0;

            return (
              <Grid item xs={12} sm={6} lg={3} key={period.key}>
                <Card
                  sx={{
                    borderRadius: 2.5,
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ height: 3, background: period.gradient }} />
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: "#888", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {period.label}
                      </Typography>
                      <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: period.gradient,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white",
                      }}>
                        {period.icon}
                      </Box>
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a2e", mb: 1 }}>
                      {formatCurrency(data.totalSales)}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ShoppingCart sx={{ fontSize: 13, color: "#999" }} />
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {data.totalOrders || 0} orders
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        icon={
                          isPositive ? <ArrowUpward sx={{ fontSize: "13px !important" }} />
                            : isNegative ? <ArrowDownward sx={{ fontSize: "13px !important" }} />
                              : undefined
                        }
                        label={`${formatGrowth(data.growth)}%`}
                        sx={{
                          height: 22, fontSize: "0.7rem", fontWeight: 700,
                          bgcolor: isPositive ? "rgba(46,125,50,0.1)" : isNegative ? "rgba(198,40,40,0.1)" : "rgba(0,0,0,0.05)",
                          color: isPositive ? "#2e7d32" : isNegative ? "#c62828" : "#999",
                          "& .MuiChip-icon": { color: "inherit" },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
