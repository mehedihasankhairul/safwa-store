"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { TrendingUp } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem("token");
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        // First try monthly growth endpoint
        let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/monthly-growth`, { headers });



        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // Handle different API response structures
        let processedData = [];

        if (data.growth) {
          processedData = data.growth.map(item => ({
            month: monthNames[item._id - 1] || `Month ${item._id}`,
            totalSales: item.totalSales || 0,
            growth: parseFloat(item.growth) || 0
          }));
        } else if (data.sales) {
          processedData = data.sales.map((item, index) => ({
            month: monthNames[index] || `Month ${index + 1}`,
            totalSales: item.totalSales || item._id || 0,
            growth: 0
          }));
        } else {
          throw new Error("No valid data format");
        }

        setChartData(processedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError(error.message);
        setUsingMockData(true);
        // Set sample data on error
        setChartData(monthNames.slice(0, 6).map((month, index) => ({
          month,
          totalSales: [8500, 12000, 9800, 15200, 11000, 16500][index],
          growth: [0, 41, -18, 55, -28, 50][index]
        })));
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Monthly Sales Trend</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
            <CircularProgress />
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
              Sales Trend
            </Typography>
          </Box>
          {usingMockData && (
            <Chip label="Sample Data" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.7rem" }} />
          )}
        </Box>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#999" fontSize={12} />
            <YAxis stroke="#999" fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                padding: "10px 14px"
              }}
              formatter={(value, name) => [
                name === 'totalSales' ? `৳${value.toLocaleString()}` : `${value}%`,
                name === 'totalSales' ? 'Sales' : 'Growth'
              ]}
            />
            <Area
              type="monotone"
              dataKey="totalSales"
              stroke="#667eea"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              dot={{ r: 4, fill: "#667eea", strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 3, backgroundColor: '#667eea', borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary">Sales (৳)</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
