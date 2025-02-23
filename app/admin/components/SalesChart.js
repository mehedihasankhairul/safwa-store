"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/sales-by-month`);
        const data = await res.json();
        setChartData(data.sales || []);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchSales();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly Sales Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
