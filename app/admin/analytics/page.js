"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import dynamic from "next/dynamic"; // ✅ Dynamic Import to Prevent SSR Issues
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// ✅ Dynamically Import ApexCharts (Fixes "window is not defined" error)
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const AnalyticsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("daily"); // Default: Daily sales
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "days"));
  const [endDate, setEndDate] = useState(dayjs());
  const [totalSales, setTotalSales] = useState(0); // ✅ Store total sales in BDT

  // ✅ Fetch Sales Analytics Data
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics/sales?startDate=${startDate.format(
          "YYYY-MM-DD"
        )}&endDate=${endDate.format("YYYY-MM-DD")}&type=${timeRange}`
      );

      const data = await response.json();
      const selectedData = data[timeRange] || [];

      setSalesData(selectedData);

      // ✅ Calculate total sales in BDT (৳)
      const total = selectedData.reduce((sum, record) => sum + record.totalSales, 0);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Data when timeRange or dates change
  useEffect(() => {
    fetchSalesData();
  }, [timeRange, startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 3, margin: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            📊 Sales Analytics Dashboard
          </Typography>

          {/* ✅ Display Total Sales in BDT (৳) */}
          <Typography variant="h6" color="primary" fontWeight="bold" textAlign="center" mb={2}>
            💰 Total Sales: ৳{totalSales.toLocaleString()}
          </Typography>

          {/* ✅ Date Picker Controls */}
          <div className="flex gap-3 mb-4">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
            />
          </div>

          {/* ✅ Time Range Selector */}
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ mb: 2, width: "200px" }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>

          {/* ✅ Chart Component */}
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <ApexCharts
              options={{
                chart: { type: "bar" },
                xaxis: {
                  categories: salesData.map(
                    (data) =>
                      `${data._id.day || data._id.week || data._id.month || data._id.year}`
                  ),
                },
                title: {
                  text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Sales`,
                },
              }}
              series={[
                {
                  name: "Total Sales (৳)",
                  data: salesData.map((data) => data.totalSales),
                },
              ]}
              type="bar"
              height={350}
            />
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default AnalyticsPage;
