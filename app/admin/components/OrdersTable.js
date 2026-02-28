"use client";
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip, Box, Typography, CircularProgress, Tooltip,
  Dialog, DialogContent, DialogActions, Button, Avatar, Snackbar, Alert,
  Select, FormControl, MenuItem
} from "@mui/material";
import {
  Visibility, Delete, CheckCircle, Cancel, ShoppingBag,
  AccessTime, Phone, Email, LocationOn, Payment, ContentCopy
} from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed": return { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" };
    case "Pending": return { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" };
    case "Processing": return { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" };
    case "Cancelled": return { bg: "#fbe9e7", color: "#c62828", border: "#ef9a9a" };
    default: return { bg: "#f5f5f5", color: "#616161", border: "#e0e0e0" };
  }
};

const getPaymentStatusStyles = (status) => {
  switch (status) {
    case "paid": return { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" };
    case "pending": return { bg: "#fff3e0", color: "#e65100", border: "#ffcc80" };
    case "failed": return { bg: "#fbe9e7", color: "#c62828", border: "#ef9a9a" };
    default: return { bg: "#f5f5f5", color: "#616161", border: "#e0e0e0" };
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatFullDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
  });
};

const getTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diffMs = new Date() - new Date(dateStr);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return "";
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, orderId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { token } = useAuthStore();

  const getToken = () => token || localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const authToken = getToken();
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/admin/orders`, { headers });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const authToken = getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      setSnackbar({ open: true, message: `Order status updated to ${status}`, severity: "success" });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      setSnackbar({ open: true, message: "Failed to update order status", severity: "error" });
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const authToken = getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ paymentStatus })
      });
      setSnackbar({ open: true, message: `Payment status updated to ${paymentStatus}`, severity: "success" });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          payment: { ...prev.payment, status: paymentStatus }
        }));
      }
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setSnackbar({ open: true, message: "Failed to update payment status", severity: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, orderId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.orderId;
    setDeleteConfirm({ open: false, orderId: null });
    try {
      const authToken = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to delete");
      setSnackbar({ open: true, message: "Order deleted successfully", severity: "success" });
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      setSnackbar({ open: true, message: `Failed to delete: ${error.message}`, severity: "error" });
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  const headerCellSx = {
    fontWeight: 700, fontSize: "0.7rem", color: "#8a8fa7",
    textTransform: "uppercase", letterSpacing: "0.8px",
    bgcolor: "#fafbfd", borderBottom: "2px solid #f0f0f5", py: 1.8
  };

  return (
    <>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingBag sx={{ color: "#667eea" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
            Recent Orders
          </Typography>
          <Chip
            label={orders.length}
            size="small"
            sx={{ bgcolor: "#667eea15", color: "#667eea", fontWeight: 600, fontSize: "0.75rem" }}
          />
        </Box>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #f0f0f5", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 420 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Order ID</TableCell>
                <TableCell sx={headerCellSx}>Customer</TableCell>
                <TableCell sx={headerCellSx}>Items</TableCell>
                <TableCell sx={headerCellSx}>Total</TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={headerCellSx}>Payment</TableCell>
                <TableCell sx={headerCellSx}>Date & Time</TableCell>
                <TableCell sx={headerCellSx} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <ShoppingBag sx={{ fontSize: 56, color: "#e0e0e0", mb: 1.5 }} />
                    <Typography color="textSecondary" sx={{ fontWeight: 500 }}>No orders found</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      Orders will appear here
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.slice(0, 10).map((order) => {
                  const statusStyle = getStatusStyles(order.status);
                  const timeAgo = getTimeAgo(order.createdAt);
                  return (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#f8f9ff" },
                        transition: "background-color 0.15s",
                        cursor: "pointer",
                      }}
                      onClick={() => viewOrderDetails(order)}
                    >
                      {/* Order ID */}
                      <TableCell>
                        <Typography sx={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
                          fontWeight: 600, color: "#667eea",
                          bgcolor: "#667eea10", px: 1, py: 0.3, borderRadius: 1,
                          display: "inline-block"
                        }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </Typography>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                          <Avatar sx={{
                            width: 32, height: 32, fontSize: "0.75rem", fontWeight: 700,
                            background: "linear-gradient(135deg, #667eea, #764ba2)"
                          }}>
                            {(order.user?.name || order.contactInfo?.phone || "G").charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a2e", lineHeight: 1.3 }}>
                              {order.user?.name || "Guest"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#999", fontSize: "0.68rem" }}>
                              {order.contactInfo?.phone || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Items */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#555" }}>
                          {order.books?.length || 0} item{(order.books?.length || 0) !== 1 ? "s" : ""}
                        </Typography>
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem" }}>
                          ৳{order.totalAmount?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={order.status || "Pending"}
                          size="small"
                          sx={{
                            fontWeight: 600, fontSize: "0.7rem",
                            bgcolor: statusStyle.bg, color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            borderRadius: "6px"
                          }}
                        />
                      </TableCell>

                      {/* Payment */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="caption" sx={{ color: "#aaa", fontSize: "0.65rem", textTransform: "uppercase", fontWeight: 600 }}>
                            {order.payment?.method || "N/A"}
                          </Typography>
                          <Chip
                            label={order.payment?.status || "pending"}
                            size="small"
                            onClick={() => {
                              const statuses = ["pending", "paid", "failed"];
                              const currentIdx = statuses.indexOf(order.payment?.status || "pending");
                              const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                              updatePaymentStatus(order._id, nextStatus);
                            }}
                            sx={{
                              fontWeight: 600, fontSize: "0.65rem", textTransform: "capitalize",
                              cursor: "pointer", transition: "all 0.2s",
                              bgcolor: getPaymentStatusStyles(order.payment?.status).bg,
                              color: getPaymentStatusStyles(order.payment?.status).color,
                              border: `1px solid ${getPaymentStatusStyles(order.payment?.status).border}`,
                              borderRadius: "6px",
                              "&:hover": { transform: "scale(1.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
                            }}
                          />
                        </Box>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", fontSize: "0.8rem", lineHeight: 1.4 }}>
                            {formatDate(order.createdAt)}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 12, color: "#aaa" }} />
                            <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                              {formatTime(order.createdAt)}
                            </Typography>
                            {timeAgo && (
                              <Typography variant="caption" sx={{
                                color: "#667eea", fontSize: "0.65rem", fontWeight: 600,
                                bgcolor: "#667eea10", px: 0.7, py: 0.1, borderRadius: 0.5, ml: 0.5
                              }}>
                                {timeAgo}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: "flex", gap: 0.3, justifyContent: "center" }}>
                          <Tooltip title="View Details" arrow>
                            <IconButton size="small" sx={{
                              color: "#667eea", "&:hover": { bgcolor: "#667eea15" }
                            }} onClick={() => viewOrderDetails(order)}>
                              <Visibility sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>

                          {order.status !== "Completed" && (
                            <Tooltip title="Mark Complete" arrow>
                              <IconButton size="small" sx={{
                                color: "#2e7d32", "&:hover": { bgcolor: "#e8f5e9" }
                              }} onClick={() => updateOrderStatus(order._id, "Completed")}>
                                <CheckCircle sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {order.status !== "Cancelled" && (
                            <Tooltip title="Cancel Order" arrow>
                              <IconButton size="small" sx={{
                                color: "#e65100", "&:hover": { bgcolor: "#fff3e0" }
                              }} onClick={() => updateOrderStatus(order._id, "Cancelled")}>
                                <Cancel sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Delete" arrow>
                            <IconButton size="small" sx={{
                              color: "#c62828", "&:hover": { bgcolor: "#fbe9e7" }
                            }} onClick={() => handleDeleteClick(order._id)}>
                              <Delete sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Details Dialog — matching Orders page design */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
      >
        {selectedOrder && (
          <>
            {/* Gradient Header */}
            <Box sx={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              p: 3, color: "white"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.3, fontWeight: 500 }}>
                    Order Details
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "monospace" }}>
                      #{selectedOrder._id?.slice(-8).toUpperCase()}
                    </Typography>
                    <IconButton size="small" sx={{ color: "white", opacity: 0.7 }} onClick={() => copyToClipboard(selectedOrder._id)}>
                      <ContentCopy sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
                <Chip
                  label={selectedOrder.status || "Pending"}
                  sx={{
                    fontWeight: 700, color: "white", fontSize: "0.8rem",
                    bgcolor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)"
                  }}
                />
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {/* Timestamps */}
              <Box sx={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3,
                p: 2, bgcolor: "#f8f9fc", borderRadius: 2
              }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem" }}>
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                    {formatFullDateTime(selectedOrder.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem" }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                    {formatFullDateTime(selectedOrder.updatedAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Customer Info */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#1a1a2e", display: "flex", alignItems: "center", gap: 0.8 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: "0.65rem", background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                  {(selectedOrder.user?.name || "G").charAt(0).toUpperCase()}
                </Avatar>
                Customer Information
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
                {[
                  { icon: <ShoppingBag />, label: "Name", value: selectedOrder.user?.name || "Guest" },
                  { icon: <Phone />, label: "Phone", value: selectedOrder.contactInfo?.phone || "N/A" },
                  { icon: <Email />, label: "Email", value: selectedOrder.contactInfo?.email || selectedOrder.user?.email || "N/A" },
                  { icon: <LocationOn />, label: "Address", value: selectedOrder.shippingAddress?.fullAddress || "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, bgcolor: "#f8f9fc", borderRadius: 2 }}>
                    <Box sx={{ "& svg": { fontSize: 18, color: "#667eea" } }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#999", fontSize: "0.65rem" }}>{item.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.78rem" }}>{item.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Payment Info */}
              <Box sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                p: 2, bgcolor: "#f8f9fc", borderRadius: 2, mb: 3, flexWrap: "wrap", gap: 2
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Payment sx={{ fontSize: 20, color: "#667eea" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#999", fontSize: "0.65rem" }}>Payment Method</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                      {selectedOrder.payment?.method || "N/A"}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#999", fontSize: "0.65rem", display: "block", mb: 0.5 }}>Payment Status</Typography>
                  <FormControl size="small">
                    <Select
                      value={selectedOrder.payment?.status || "pending"}
                      onChange={(e) => updatePaymentStatus(selectedOrder._id, e.target.value)}
                      sx={{
                        minWidth: 120, borderRadius: 2, fontWeight: 700, fontSize: "0.8rem",
                        textTransform: "capitalize",
                        color: getPaymentStatusStyles(selectedOrder.payment?.status).color,
                        bgcolor: getPaymentStatusStyles(selectedOrder.payment?.status).bg,
                        "& fieldset": { borderColor: getPaymentStatusStyles(selectedOrder.payment?.status).border },
                        "&:hover fieldset": { borderColor: getPaymentStatusStyles(selectedOrder.payment?.status).color + " !important" },
                      }}
                    >
                      <MenuItem value="pending" sx={{ fontWeight: 600, color: "#e65100" }}>⏳ Pending</MenuItem>
                      <MenuItem value="paid" sx={{ fontWeight: 600, color: "#2e7d32" }}>✅ Paid</MenuItem>
                      <MenuItem value="failed" sx={{ fontWeight: 600, color: "#c62828" }}>❌ Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Ordered Books */}
              {selectedOrder.books && selectedOrder.books.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#1a1a2e" }}>
                    📦 Ordered Items ({selectedOrder.books.length})
                  </Typography>
                  <Box sx={{ border: "1px solid #f0f0f5", borderRadius: 2, overflow: "hidden", mb: 2 }}>
                    {selectedOrder.books.map((book, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          p: 1.5, borderBottom: index < selectedOrder.books.length - 1 ? "1px solid #f0f0f5" : "none",
                          "&:hover": { bgcolor: "#fafbfd" }
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box sx={{
                            width: 36, height: 36, borderRadius: 1.5, bgcolor: "#667eea10",
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <ShoppingBag sx={{ fontSize: 16, color: "#667eea" }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {book.bookId?.title || book.title || "Unknown Book"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#999" }}>
                              Qty: {book.quantity} × ৳{book.price}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
                          ৳{(book.quantity * book.price).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                    {/* Total */}
                    <Box sx={{
                      display: "flex", justifyContent: "space-between",
                      p: 1.5, bgcolor: "#f8f9fc", borderTop: "2px solid #f0f0f5"
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Total</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: "#667eea" }}>
                        ৳{selectedOrder.totalAmount?.toLocaleString() || 0}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <Box sx={{ p: 2, bgcolor: "#fffef5", border: "1px solid #fff3cd", borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: "#856404", fontWeight: 600 }}>📝 Customer Notes</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#856404" }}>{selectedOrder.notes}</Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: "1px solid #f0f0f5", gap: 1 }}>
              {selectedOrder.status !== "Completed" && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircle />}
                  onClick={() => { updateOrderStatus(selectedOrder._id, "Completed"); setOpenDialog(false); }}
                  sx={{
                    borderRadius: 2, textTransform: "none", fontWeight: 600,
                    bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }
                  }}
                >
                  Mark Complete
                </Button>
              )}
              {selectedOrder.status !== "Cancelled" && (
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => { updateOrderStatus(selectedOrder._id, "Cancelled"); setOpenDialog(false); }}
                  sx={{
                    borderRadius: 2, textTransform: "none", fontWeight: 600,
                    borderColor: "#e65100", color: "#e65100",
                    "&:hover": { bgcolor: "#fff3e0", borderColor: "#e65100" }
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, color: "#888", ml: "auto" }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, orderId: null })}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Delete sx={{ fontSize: 48, color: "#c62828", mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#c62828", mb: 1 }}>
            Delete Order
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
            <Button
              onClick={() => setDeleteConfirm({ open: false, orderId: null })}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, color: "#888", px: 3 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteConfirm}
              sx={{
                borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3,
                bgcolor: "#c62828", "&:hover": { bgcolor: "#b71c1c" }
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrdersTable;
