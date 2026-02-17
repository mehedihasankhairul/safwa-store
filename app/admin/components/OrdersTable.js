"use client";
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip, Box, Typography, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar
} from "@mui/material";
import { Visibility, Edit, Delete, CheckCircle, Cancel, ShoppingBag } from "@mui/icons-material";
import useAuthStore from "../../../store/authStore";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const authToken = token || localStorage.getItem("token");
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, { headers });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const authToken = token || localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const authToken = token || localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "Processing": return "info";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingBag sx={{ color: "#667eea" }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
            Recent Orders
          </Typography>
          <Chip label={orders.length} size="small" sx={{ bgcolor: "#667eea", color: "white", fontWeight: 600, fontSize: "0.75rem" }} />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400, borderRadius: 2, boxShadow: "none", border: "1px solid #f0f0f0" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, bgcolor: "#fafafa" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <ShoppingBag sx={{ fontSize: 48, color: "#ddd", mb: 1 }} />
                  <Typography color="textSecondary">No orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.slice(0, 10).map((order) => (
                <TableRow key={order._id} hover sx={{ "&:hover": { bgcolor: "#f8f9ff" } }}>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#667eea" }}>
                    #{order._id?.slice(-8) || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#667eea", fontSize: "0.7rem" }}>
                        {(order.userName || "G").charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.userName || "Guest"}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#1a1a2e" }}>
                    ৳{order.totalAmount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || "Pending"}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#888", fontSize: "0.8rem" }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          sx={{ color: "#667eea" }}
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {order.status !== "Completed" && (
                        <Tooltip title="Mark Complete">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => updateOrderStatus(order._id, "Completed")}
                          >
                            <CheckCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {order.status !== "Cancelled" && (
                        <Tooltip title="Cancel">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => updateOrderStatus(order._id, "Cancelled")}
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteOrder(order._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: "1px solid #f0f0f0" }}>Order Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder && (
            <Box sx={{ display: "grid", gap: 1.5 }}>
              <Typography><strong>Order ID:</strong> <code>{selectedOrder._id}</code></Typography>
              <Typography><strong>Customer:</strong> {selectedOrder.userName || "Guest"}</Typography>
              <Typography><strong>Email:</strong> {selectedOrder.email || "N/A"}</Typography>
              <Typography><strong>Phone:</strong> {selectedOrder.phone || "N/A"}</Typography>
              <Typography><strong>Address:</strong> {selectedOrder.fullAddress || "N/A"}</Typography>
              <Typography><strong>Total Amount:</strong> <strong style={{ color: "#11998e" }}>৳{selectedOrder.totalAmount?.toLocaleString() || 0}</strong></Typography>
              <Typography><strong>Status:</strong>
                <Chip
                  label={selectedOrder.status || "Pending"}
                  color={getStatusColor(selectedOrder.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography><strong>Order Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}</Typography>

              {selectedOrder.books && selectedOrder.books.length > 0 && (
                <Box sx={{ mt: 1, p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Ordered Books:</Typography>
                  {selectedOrder.books.map((book, index) => (
                    <Box key={index} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                      <Typography variant="body2">• {book.title} (x{book.quantity})</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>৳{book.price}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #f0f0f0" }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersTable;
