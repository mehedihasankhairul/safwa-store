"use client";
import { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, CircularProgress, Box,
  Chip, Table, TableBody, TableCell, TableHead, TableRow, Avatar,
  LinearProgress
} from "@mui/material";
import {
  TrendingUp, TrendingDown, CalendarToday, DateRange,
  CalendarMonth, EventNote, ShoppingCart, EmojiEvents,
  Category, BarChart as BarChartIcon, ArrowUpward, ArrowDownward
} from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell
} from "recharts";
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
    label: "Today's Sales",
    subtitle: "vs yesterday",
    icon: <CalendarToday sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    lightBg: "#f0ecff",
    accentColor: "#667eea",
  },
  {
    key: "weekly",
    label: "This Week",
    subtitle: "vs last week",
    icon: <DateRange sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    lightBg: "#e6fff2",
    accentColor: "#11998e",
  },
  {
    key: "monthly",
    label: "This Month",
    subtitle: "vs last month",
    icon: <CalendarMonth sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
    lightBg: "#fff0f3",
    accentColor: "#ee9ca7",
  },
  {
    key: "yearly",
    label: "This Year",
    subtitle: "vs last year",
    icon: <EventNote sx={{ fontSize: 22 }} />,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    lightBg: "#fff0f5",
    accentColor: "#f093fb",
  },
];

const CHART_COLORS = ["#667eea", "#11998e", "#ee9ca7", "#f093fb", "#FFD700"];

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const authToken = token || localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/analytics/sales`, {
          method: "GET",
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
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
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
          ⚠️ Failed to load analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  // Prepare chart data
  const chartData = periodConfig.map((p) => ({
    period: p.label.replace("This ", "").replace("Today's ", ""),
    totalSales: analytics?.[p.key]?.totalSales || 0,
    totalOrders: analytics?.[p.key]?.totalOrders || 0,
  }));

  const topBooks = analytics?.topBooks || [];
  const topCategories = analytics?.topCategories || [];
  const maxCategoryRevenue = topCategories.length > 0 ? Math.max(...topCategories.map(c => c.totalSales)) : 1;

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* ═══════════ Header Banner ═══════════ */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(102, 126, 234, 0.15)",
        }} />
        <Box sx={{
          position: "absolute", bottom: -60, right: 80,
          width: 150, height: 150, borderRadius: "50%",
          background: "rgba(118, 75, 162, 0.1)",
        }} />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <BarChartIcon sx={{ fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "2rem" } }}>
              Sales Analytics
            </Typography>
          </Box>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Comprehensive overview of your store&apos;s performance across all time periods.
          </Typography>
        </Box>
      </Box>

      {/* ═══════════ Revenue Cards ═══════════ */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {periodConfig.map((period) => {
          const data = analytics?.[period.key] || {};
          const growth = parseFloat(data.growth);
          const isPositive = growth > 0;
          const isNegative = growth < 0;
          const isZero = growth === 0 || isNaN(growth);

          return (
            <Grid item xs={12} sm={6} md={3} key={period.key}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* Gradient Top Strip */}
                <Box sx={{ height: 4, background: period.gradient }} />
                <CardContent sx={{ p: 2.5 }}>
                  {/* Icon + Label */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#888",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {period.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#bbb", fontSize: "0.68rem" }}>
                        {period.subtitle}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        background: period.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {period.icon}
                    </Box>
                  </Box>

                  {/* Revenue */}
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2, mb: 1 }}>
                    {formatCurrency(data.totalSales)}
                  </Typography>

                  {/* Orders + Growth */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ShoppingCart sx={{ fontSize: 14, color: "#999" }} />
                      <Typography variant="caption" sx={{ color: "#999", fontWeight: 500 }}>
                        {data.totalOrders || 0} orders
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      icon={
                        isPositive ? (
                          <ArrowUpward sx={{ fontSize: "14px !important" }} />
                        ) : isNegative ? (
                          <ArrowDownward sx={{ fontSize: "14px !important" }} />
                        ) : undefined
                      }
                      label={`${formatGrowth(data.growth)}%`}
                      sx={{
                        height: 24,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        bgcolor: isPositive
                          ? "rgba(46, 125, 50, 0.1)"
                          : isNegative
                            ? "rgba(198, 40, 40, 0.1)"
                            : "rgba(0,0,0,0.05)",
                        color: isPositive ? "#2e7d32" : isNegative ? "#c62828" : "#999",
                        "& .MuiChip-icon": {
                          color: "inherit",
                        },
                      }}
                    />
                  </Box>

                  {/* Previous period */}
                  {data.previousSales > 0 && (
                    <Typography variant="caption" sx={{ color: "#bbb", display: "block", mt: 1, fontSize: "0.68rem" }}>
                      Previous: {formatCurrency(data.previousSales)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ═══════════ Charts Row ═══════════ */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Sales Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
            <Box sx={{ height: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <TrendingUp sx={{ color: "#667eea" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
                  Revenue Comparison
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barCategoryGap="25%">
                  <defs>
                    <linearGradient id="analyticsBarGradient" x1="0" y1="0" x2="0" y2="1">
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
                      padding: "12px 16px",
                    }}
                    formatter={(value, name) => [
                      name === "totalSales" ? `৳${value.toLocaleString()}` : value,
                      name === "totalSales" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Bar dataKey="totalSales" fill="url(#analyticsBarGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2, display: "flex", gap: 3, justifyContent: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 1 }} />
                  <Typography variant="caption" color="text.secondary">Revenue (৳)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Pie Chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
            <Box sx={{ height: 4, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }} />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Category sx={{ color: "#f093fb" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
                  Top Categories
                </Typography>
              </Box>

              {topCategories.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={topCategories.map((c) => ({ name: c.category || c._id, value: c.totalSales }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {topCategories.map((_, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12, border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          padding: "10px 14px",
                        }}
                        formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Category Legend + Bars */}
                  <Box sx={{ mt: 1 }}>
                    {topCategories.map((cat, idx) => (
                      <Box key={cat._id || idx} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{
                              width: 10, height: 10, borderRadius: "50%",
                              bgcolor: CHART_COLORS[idx % CHART_COLORS.length],
                            }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#333", fontSize: "0.8rem" }}>
                              {cat.category || cat._id || "Uncategorized"}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.8rem" }}>
                            {formatCurrency(cat.totalSales)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(cat.totalSales / maxCategoryRevenue) * 100}
                          sx={{
                            height: 5, borderRadius: 3,
                            bgcolor: "rgba(0,0,0,0.04)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              bgcolor: CHART_COLORS[idx % CHART_COLORS.length],
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Category sx={{ fontSize: 48, color: "#ddd", mb: 1 }} />
                  <Typography color="text.secondary">No category data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ═══════════ Top Selling Books ═══════════ */}
      <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 4, background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <EmojiEvents sx={{ color: "#FFD700" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              Top Selling Books
            </Typography>
          </Box>

          {topBooks.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>
                    Book Title
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>
                    Units Sold
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, border: "none", pb: 1 }}>
                    Revenue
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topBooks.map((book, index) => (
                  <TableRow
                    key={book._id}
                    sx={{
                      "&:last-child td": { border: 0 },
                      "&:hover": { bgcolor: "#f8f9fa" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell sx={{ border: "none", py: 1.5 }}>
                      {index < 3 ? (
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: medalColors[index],
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      ) : (
                        <Typography variant="body2" sx={{ pl: 0.5, color: "#999" }}>
                          {index + 1}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ border: "none", py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
                        {book.title}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ border: "none", py: 1.5 }}>
                      <Chip
                        label={book.totalSold}
                        size="small"
                        sx={{
                          bgcolor: "#e8f5e9",
                          color: "#2e7d32",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ border: "none", py: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a2e" }}>
                        {formatCurrency(book.revenue)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <EmojiEvents sx={{ fontSize: 48, color: "#ddd", mb: 1 }} />
              <Typography color="text.secondary">No sales data available yet</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ═══════════ Orders Summary ═══════════ */}
      <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 4, background: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)" }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ShoppingCart sx={{ color: "#ee9ca7" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              Orders Summary
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {periodConfig.map((period) => {
              const data = analytics?.[period.key] || {};
              return (
                <Grid item xs={6} sm={3} key={`orders-${period.key}`}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#f8f9fc",
                      border: "1px solid #f0f0f5",
                      textAlign: "center",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "#f0f2f8", borderColor: "#e0e2ea" },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#999",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      {period.label.replace("Today's Sales", "Today").replace("This ", "")}
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: "#1a1a2e", fontSize: "1.5rem", my: 0.5 }}>
                      {data.totalOrders || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                      orders
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticsPage;
