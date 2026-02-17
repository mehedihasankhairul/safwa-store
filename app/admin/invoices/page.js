"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Chip, CircularProgress, Avatar, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogContent,
  Button, Divider, Snackbar, Alert, TextField, InputAdornment,
  MenuItem, Select, FormControl, Fade, Slide
} from "@mui/material";
import {
  Visibility, Email, Download, Delete, Receipt,
  Search, Person, Phone, LocationOn, CalendarToday,
  FilterList, Refresh, Close, TrendingUp,
  ShoppingBag, CheckCircleOutline, PendingActions, ContentCopy
} from "@mui/icons-material";
import Link from "next/link";
import useAuthStore from "../../../store/authStore";

const AdminInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [copiedId, setCopiedId] = useState(null);
  const { token } = useAuthStore();
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  // Computed stats
  const stats = useMemo(() => ({
    total: invoices.length,
    revenue: invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
    paid: invoices.filter(inv => inv.paymentStatus === "Paid").length,
    pending: invoices.filter(inv => inv.paymentStatus !== "Paid").length,
  }), [invoices]);

  // Filter logic
  useEffect(() => {
    let result = invoices;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(inv =>
        inv.orderId?.toLowerCase().includes(q) ||
        inv.userName?.toLowerCase().includes(q) ||
        inv.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter(inv => inv.paymentStatus === statusFilter);
    }
    setFilteredInvoices(result);
  }, [invoices, searchQuery, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invoices/admin/invoices`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to fetch admin invoices:", error);
      setSnackbar({ open: true, message: "Failed to load invoices", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInvoice = async (orderId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invoices/admin/invoices/${orderId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const invoiceData = await response.json();
      setSelectedInvoice(invoiceData);
    } catch (error) {
      console.error("Failed to fetch admin invoice:", error);
      setSnackbar({ open: true, message: "Failed to load invoice details", severity: "error" });
    }
  };

  const sendInvoiceEmail = async (orderId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invoices/send-email/${orderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSnackbar({ open: true, message: "✉️ Invoice email sent!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to send email", severity: "error" });
    }
  };

  const deleteInvoice = async (orderId) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invoices/admin/invoices/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setSnackbar({ open: true, message: "Invoice deleted", severity: "success" });
      fetchInvoices();
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete invoice", severity: "error" });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => { fetchInvoices(); }, []);

  // --- STYLES ---
  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(0,0,0,0.06)",
    bgcolor: "#fff",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  };

  const statCardStyle = (gradient) => ({
    ...cardStyle,
    p: 2.5,
    cursor: "default",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transform: "translateY(-1px)",
    },
  });

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3 }} />)}
        </Box>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>

      {/* ─────── Stat Cards ─────── */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
        gap: 2,
        mb: 3,
      }}>
        {/* Total Invoices */}
        <Box sx={statCardStyle()}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Receipt sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
            {stats.total}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>
            Total Invoices
          </Typography>
        </Box>

        {/* Revenue */}
        <Box sx={statCardStyle()}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TrendingUp sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
            ৳{stats.revenue.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>
            Total Revenue
          </Typography>
        </Box>

        {/* Paid */}
        <Box sx={statCardStyle()}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <CheckCircleOutline sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
            {stats.paid}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>
            Paid Invoices
          </Typography>
        </Box>

        {/* Pending */}
        <Box sx={statCardStyle()}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PendingActions sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
            {stats.pending}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>
            Pending
          </Typography>
        </Box>
      </Box>

      {/* ─────── Table Card ─────── */}
      <Box sx={cardStyle}>
        {/* Toolbar */}
        <Box sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            All Invoices
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: "#9ca3af" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px", fontSize: "0.82rem", bgcolor: "#f9fafb",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1.5 },
                },
              }}
            />
            <FormControl size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  borderRadius: "10px", fontSize: "0.82rem", bgcolor: "#f9fafb",
                  minWidth: 120,
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchInvoices} sx={{
                bgcolor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}>
                <Refresh sx={{ fontSize: 18, color: "#6b7280" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Table */}
        {filteredInvoices.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: "16px", bgcolor: "#f3f4f6",
              display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2,
            }}>
              <Receipt sx={{ fontSize: 28, color: "#9ca3af" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>No invoices found</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              {searchQuery || statusFilter !== "All" ? "Try adjusting your filters" : "Invoices will appear here once orders are placed"}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Invoice", "Customer", "Amount", "Date", "Status", ""].map((h) => (
                    <TableCell key={h} sx={{
                      fontWeight: 600, color: "#6b7280", fontSize: "0.72rem",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      py: 1.5, px: 2.5,
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice, idx) => (
                  <TableRow
                    key={invoice.orderId}
                    sx={{
                      cursor: "pointer",
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#fafafe" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                    onClick={() => fetchAdminInvoice(invoice.orderId)}
                  >
                    <TableCell sx={{ px: 2.5, py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: "10px",
                          bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Receipt sx={{ fontSize: 16, color: "#6366f1" }} />
                        </Box>
                        <Box>
                          <Typography sx={{
                            fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                            fontSize: "0.8rem", color: "#111827", fontWeight: 600,
                          }}>
                            #{invoice.orderId?.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 2.5, py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{
                          width: 32, height: 32, fontSize: "0.75rem", fontWeight: 700,
                          bgcolor: `hsl(${(invoice.userName || "U").charCodeAt(0) * 7 % 360}, 55%, 92%)`,
                          color: `hsl(${(invoice.userName || "U").charCodeAt(0) * 7 % 360}, 55%, 35%)`,
                        }}>
                          {(invoice.userName || "U").charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#111827", lineHeight: 1.3 }}>
                            {invoice.userName || "Customer"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                            {invoice.email || "—"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ px: 2.5, py: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.88rem" }}>
                        ৳{invoice.totalAmount?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2.5, py: 2 }}>
                      <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric"
                        }) : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2.5, py: 2 }}>
                      <Chip
                        label={invoice.paymentStatus === "Paid" ? "Paid" : "Pending"}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: invoice.paymentStatus === "Paid" ? "#ecfdf5" : "#fffbeb",
                          color: invoice.paymentStatus === "Paid" ? "#059669" : "#d97706",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          border: `1px solid ${invoice.paymentStatus === "Paid" ? "#a7f3d0" : "#fde68a"}`,
                          "& .MuiChip-label": { px: 1.5 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 2.5, py: 2 }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                        <Tooltip title="Preview" arrow>
                          <IconButton size="small" onClick={() => fetchAdminInvoice(invoice.orderId)}
                            sx={{ color: "#6366f1", "&:hover": { bgcolor: "#eef2ff" } }}>
                            <Visibility sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Email Invoice" arrow>
                          <IconButton size="small" onClick={() => sendInvoiceEmail(invoice.orderId)}
                            sx={{ color: "#3b82f6", "&:hover": { bgcolor: "#eff6ff" } }}>
                            <Email sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        {invoice.invoiceUrl && (
                          <Tooltip title="Download PDF" arrow>
                            <IconButton size="small" component={Link}
                              href={`${process.env.NEXT_PUBLIC_BASE_URL}${invoice.invoiceUrl}`}
                              target="_blank"
                              sx={{ color: "#10b981", "&:hover": { bgcolor: "#ecfdf5" } }}>
                              <Download sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete" arrow>
                          <IconButton size="small" onClick={() => deleteInvoice(invoice.orderId)}
                            sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" } }}>
                            <Delete sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Table footer */}
        {filteredInvoices.length > 0 && (
          <Box sx={{
            p: 2, borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─────── Invoice Detail Drawer-Style Dialog ─────── */}
      <Dialog
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: {
            borderRadius: "20px", overflow: "hidden",
            maxHeight: "90vh",
          },
        }}
      >
        {selectedInvoice && (
          <>
            {/* Dialog Header */}
            <Box sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              px: 3, py: 3, color: "#fff", position: "relative",
            }}>
              <IconButton
                onClick={() => setSelectedInvoice(null)}
                sx={{
                  position: "absolute", top: 12, right: 12,
                  color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Close />
              </IconButton>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Receipt sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.7rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
                    Invoice
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem",
                      fontWeight: 600, opacity: 0.9,
                    }}>
                      #{selectedInvoice.orderId?.slice(-12)}
                    </Typography>
                    <Tooltip title={copiedId === selectedInvoice.orderId ? "Copied!" : "Copy ID"}>
                      <IconButton size="small" onClick={() => copyToClipboard(selectedInvoice.orderId)}
                        sx={{ color: "rgba(255,255,255,0.6)", p: 0.3 }}>
                        <ContentCopy sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Amount & Status */}
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  ৳{selectedInvoice.totalAmount?.toLocaleString()}
                </Typography>
                <Chip
                  label={selectedInvoice.paymentStatus === "Paid" ? "✓ Paid" : "⏳ Pending"}
                  size="small"
                  sx={{
                    bgcolor: selectedInvoice.paymentStatus === "Paid" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.15)",
                    color: "#fff", fontWeight: 600, fontSize: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.25)",
                    mb: 0.5,
                  }}
                />
              </Box>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              {/* Info Grid */}
              <Box sx={{ p: 3 }}>
                {/* Date */}
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 2,
                  p: 1.5, bgcolor: "#f9fafb", borderRadius: "12px", mb: 2.5,
                }}>
                  <CalendarToday sx={{ fontSize: 16, color: "#6b7280" }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>Order Date</Typography>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>
                      {selectedInvoice.orderDate ? new Date(selectedInvoice.orderDate).toLocaleDateString("en-GB", {
                        weekday: "long", day: "2-digit", month: "long", year: "numeric"
                      }) : "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* Customer Section */}
                <Typography sx={{
                  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "#9ca3af", mb: 1.5,
                }}>
                  Customer Details
                </Typography>
                <Box sx={{
                  border: "1px solid #f3f4f6", borderRadius: "14px", p: 2, mb: 2.5,
                }}>
                  {[
                    { icon: <Person sx={{ fontSize: 16 }} />, label: "Name", value: selectedInvoice.userName },
                    { icon: <Email sx={{ fontSize: 16 }} />, label: "Email", value: selectedInvoice.email },
                    { icon: <Phone sx={{ fontSize: 16 }} />, label: "Phone", value: selectedInvoice.phone },
                    { icon: <LocationOn sx={{ fontSize: 16 }} />, label: "Address", value: selectedInvoice.fullAddress },
                  ].map((item, i) => (
                    <Box key={i} sx={{
                      display: "flex", alignItems: "center", gap: 1.5, py: 1,
                      borderBottom: i < 3 ? "1px solid #f9fafb" : "none",
                    }}>
                      <Box sx={{
                        width: 30, height: 30, borderRadius: "8px", bgcolor: "#f3f4f6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#6b7280", flexShrink: 0,
                      }}>
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{
                          fontSize: "0.82rem", color: "#111827", fontWeight: 500,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.value || "—"}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Items */}
                <Typography sx={{
                  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "#9ca3af", mb: 1.5,
                }}>
                  Items Ordered
                </Typography>
                <Box sx={{ border: "1px solid #f3f4f6", borderRadius: "14px", overflow: "hidden" }}>
                  {selectedInvoice.books?.length > 0 ? (
                    selectedInvoice.books.map((book, i) => (
                      <Box key={i} sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 2, py: 1.5,
                        borderBottom: i < selectedInvoice.books.length - 1 ? "1px solid #f9fafb" : "none",
                        "&:hover": { bgcolor: "#fafafe" },
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: "8px",
                            bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <ShoppingBag sx={{ fontSize: 15, color: "#6366f1" }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#111827" }}>
                              {book.title}
                            </Typography>
                            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                              Qty: {book.quantity}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.88rem" }}>
                          ৳{book.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>No items</Typography>
                    </Box>
                  )}

                  {/* Total row */}
                  {selectedInvoice.books?.length > 0 && (
                    <Box sx={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      px: 2, py: 1.5, bgcolor: "#f9fafb", borderTop: "1px solid #f3f4f6",
                    }}>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#6b7280" }}>Total</Typography>
                      <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>
                        ৳{selectedInvoice.totalAmount?.toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{
                px: 3, py: 2, borderTop: "1px solid #f3f4f6",
                display: "flex", gap: 1.5, justifyContent: "flex-end",
              }}>
                <Button
                  onClick={() => setSelectedInvoice(null)}
                  sx={{
                    textTransform: "none", borderRadius: "10px", color: "#6b7280",
                    fontSize: "0.82rem", fontWeight: 600, px: 2.5,
                    "&:hover": { bgcolor: "#f3f4f6" },
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => sendInvoiceEmail(selectedInvoice.orderId)}
                  startIcon={<Email sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: "none", borderRadius: "10px",
                    fontSize: "0.82rem", fontWeight: 600, px: 2.5,
                    border: "1px solid #e5e7eb", color: "#374151",
                    "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
                  }}
                >
                  Send Email
                </Button>
                {selectedInvoice.invoiceUrl && (
                  <Button
                    component={Link}
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedInvoice.invoiceUrl}`}
                    target="_blank"
                    variant="contained"
                    startIcon={<Download sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: "none", borderRadius: "10px",
                      fontSize: "0.82rem", fontWeight: 600, px: 2.5,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                      },
                    }}
                  >
                    Download PDF
                  </Button>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "12px", fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminInvoicesPage;
