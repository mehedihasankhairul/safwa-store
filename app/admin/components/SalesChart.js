"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from "@mui/material";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, Bar, BarChart } from "recharts";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [yearlyGrowth, setYearlyGrowth] = useState(0);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem("token");
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/sales`, { headers });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // Build chart data from the API response
        const processedData = [
          {
            period: "Daily",
            totalSales: data.daily?.totalSales || 0,
            totalOrders: data.daily?.totalOrders || 0,
            growth: data.daily?.growth || 0,
          },
          {
            period: "Weekly",
            totalSales: data.weekly?.totalSales || 0,
            totalOrders: data.weekly?.totalOrders || 0,
            growth: data.weekly?.growth || 0,
          },
          {
            period: "Monthly",
            totalSales: data.monthly?.totalSales || 0,
            totalOrders: data.monthly?.totalOrders || 0,
            growth: data.monthly?.growth || 0,
          },
          {
            period: "Yearly",
            totalSales: data.yearly?.totalSales || 0,
            totalOrders: data.yearly?.totalOrders || 0,
            growth: data.yearly?.growth || 0,
          },
        ];

        setChartData(processedData);
        setTotalSales(data.yearly?.totalSales || 0);
        setYearlyGrowth(data.yearly?.growth || 0);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [token]);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, height: "100%" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Sales Overview</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
            <CircularProgress sx={{ color: "#667eea" }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, height: "100%" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Sales Overview</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280, flexDirection: "column", gap: 1 }}>
            <Typography color="error" sx={{ fontWeight: 500 }}>⚠️ Failed to load sales data</Typography>
            <Typography variant="body2" color="textSecondary">{error}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, height: "100%", overflow: "hidden" }}>
      {/* Gradient header strip */}
      <Box sx={{ height: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp sx={{ color: "#667eea" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              Sales Overview
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#667eea" }}>
              ৳{totalSales.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, justifyContent: "flex-end" }}>
              {yearlyGrowth >= 0 ? (
                <TrendingUp sx={{ fontSize: 14, color: "#2e7d32" }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: "#c62828" }} />
              )}
              <Typography variant="caption" sx={{
                fontWeight: 600,
                color: yearlyGrowth >= 0 ? "#2e7d32" : "#c62828"
              }}>
                {yearlyGrowth}% yearly
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, mb: 3 }}>
          {chartData.map((item) => (
            <Box key={item.period} sx={{
              p: 1.5, borderRadius: 2, bgcolor: "#f8f9fc",
              border: "1px solid #f0f0f5", textAlign: "center",
            }}>
              <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem" }}>
                {item.period}
              </Typography>
              <Typography sx={{ fontWeight: 800, color: "#1a1a2e", fontSize: "1rem" }}>
                ৳{item.totalSales.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{
                fontWeight: 600,
                color: item.growth >= 0 ? "#2e7d32" : "#c62828",
                fontSize: "0.7rem"
              }}>
                {item.growth >= 0 ? "+" : ""}{item.growth}%
              </Typography>
              <Typography variant="caption" sx={{ color: "#999", display: "block", fontSize: "0.65rem" }}>
                {item.totalOrders} orders
              </Typography>
            </Box>
          ))}
        </Box>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="25%">
            <defs>
              <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#667eea" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#764ba2" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="period" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "10px 14px"
              }}
              formatter={(value, name) => [
                name === 'totalSales' ? `৳${value.toLocaleString()}` : value,
                name === 'totalSales' ? 'Sales' : 'Orders'
              ]}
            />
            <Bar
              dataKey="totalSales"
              fill="url(#salesBarGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary">Sales (৳)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
