"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, Chip,
  TableHead, TableRow, IconButton, CircularProgress, Dialog, Avatar, Skeleton,
  DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  MenuItem, Select, FormControl, Tooltip, Snackbar, Alert, Fade
} from "@mui/material";
import {
  Add, Edit, Delete, Search, Refresh, MenuBook,
  Inventory2, TrendingUp, Category, WarningAmber,
  Close, FilterList, ViewList, GridView
} from "@mui/icons-material";
import useBookStore from "@/store/bookStore";
import AddBookModal from "../../components/AddBookModal";
import Image from "next/image";
import dummyCover from "../../../public/assets/dummy.png";

const AdminBooksPage = () => {
  const { books, fetchBooks, deleteBook } = useBookStore();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Stats
  const stats = useMemo(() => {
    const categories = [...new Set(books.map(b => b.category).filter(Boolean))];
    const totalStock = books.reduce((sum, b) => sum + (b.stock || 0), 0);
    const lowStock = books.filter(b => (b.stock || 0) <= 5).length;
    const totalValue = books.reduce((sum, b) => sum + ((b.salePrice || 0) * (b.stock || 0)), 0);
    return { total: books.length, categories: categories.length, totalStock, lowStock, totalValue, categoryList: categories };
  }, [books]);

  // Filter
  const filteredBooks = useMemo(() => {
    let result = books;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") {
      result = result.filter(b => b.category === categoryFilter);
    }
    return result;
  }, [books, searchQuery, categoryFilter]);

  useEffect(() => {
    const loadBooks = async () => {
      await fetchBooks();
      setLoading(false);
    };
    loadBooks();
    setIsClient(true);
  }, []);

  const handleDeleteBook = async () => {
    if (deleteConfirm) {
      await deleteBook(deleteConfirm);
      setDeleteConfirm(null);
      setSnackbar({ open: true, message: "Book deleted successfully", severity: "success" });
    }
  };

  // Styles
  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(0,0,0,0.06)",
    bgcolor: "#fff",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  };

  const statCardStyle = {
    ...cardStyle,
    p: 2.5,
    cursor: "default",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transform: "translateY(-1px)",
    },
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3 }} />)}
        </Box>
        <Skeleton variant="rounded" height={500} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>

      {/* ─────── Stat Cards ─────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
        <Box sx={statCardStyle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MenuBook sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{stats.total}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>Total Books</Typography>
        </Box>

        <Box sx={statCardStyle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Inventory2 sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{stats.totalStock}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>Total Stock</Typography>
        </Box>

        <Box sx={statCardStyle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <WarningAmber sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{stats.lowStock}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>Low Stock (≤5)</Typography>
        </Box>

        <Box sx={statCardStyle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Category sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{stats.categories}</Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mt: 0.5, fontWeight: 500 }}>Categories</Typography>
        </Box>
      </Box>

      {/* ─────── Main Table Card ─────── */}
      <Box sx={cardStyle}>
        {/* Toolbar */}
        <Box sx={{
          p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
              Books Inventory
            </Typography>
            <Chip label={filteredBooks.length} size="small" sx={{
              bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 700, fontSize: "0.75rem", height: 22,
            }} />
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search books..."
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
                width: 200,
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  borderRadius: "10px", fontSize: "0.82rem", bgcolor: "#f9fafb", minWidth: 130,
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                }}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {stats.categoryList.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={() => { setLoading(true); fetchBooks().then(() => setLoading(false)); }}
                sx={{ bgcolor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", "&:hover": { bgcolor: "#f3f4f6" } }}>
                <Refresh sx={{ fontSize: 18, color: "#6b7280" }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: 18 }} />}
              onClick={() => { setEditingBook(null); setShowModal(true); }}
              sx={{
                textTransform: "none", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 2px 8px rgba(99,102,241,0.3)", px: 2.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                },
              }}
            >
              Add Book
            </Button>
          </Box>
        </Box>

        {/* Table */}
        {filteredBooks.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: "16px", bgcolor: "#f3f4f6",
              display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2,
            }}>
              <MenuBook sx={{ fontSize: 28, color: "#9ca3af" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 0.5 }}>No books found</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              {searchQuery || categoryFilter !== "All" ? "Try adjusting your filters" : "Add your first book to get started"}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Book", "", "Category", "Price", "Discount", "Sale Price", "Stock", ""].map((h, i) => (
                    <TableCell key={i} sx={{
                      fontWeight: 600, color: "#6b7280", fontSize: "0.72rem",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid rgba(0,0,0,0.06)", py: 1.5, px: 2,
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.map((book, idx) => (
                  <TableRow key={book._id || `book-${idx}`} sx={{
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: "#fafafe" },
                    "&:last-child td": { borderBottom: 0 },
                  }}>
                    {/* Cover + Title */}
                    <TableCell sx={{ px: 2, py: 1.5, width: 56 }}>
                      {isClient ? (
                        <Box sx={{
                          width: 44, height: 60, borderRadius: "8px", overflow: "hidden",
                          bgcolor: "#f3f4f6", flexShrink: 0, position: "relative",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}>
                          {book.coverImgs && book.coverImgs.length > 0 ? (
                            <Image
                              src={book.coverImgs[0]}
                              alt={book.title}
                              width={44} height={60}
                              style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                          ) : (
                            <Avatar
                              src={book.coverImg || dummyCover?.src}
                              alt={book.title}
                              variant="rounded"
                              sx={{ width: 44, height: 60, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      ) : (
                        <Skeleton variant="rounded" width={44} height={60} />
                      )}
                    </TableCell>
                    <TableCell sx={{ px: 1, py: 1.5 }}>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", lineHeight: 1.3, mb: 0.3 }}>
                        {book.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        {book.author}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Chip label={book.category || "—"} size="small" sx={{
                        height: 22, bgcolor: "#f3f4f6", color: "#374151",
                        fontSize: "0.7rem", fontWeight: 500,
                        "& .MuiChip-label": { px: 1.2 },
                      }} />
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Typography sx={{ fontSize: "0.82rem", color: "#6b7280" }}>
                        ৳{book.printedPrice?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      {book.discount > 0 ? (
                        <Chip label={`${book.discount}%`} size="small" sx={{
                          height: 22, bgcolor: "#fef3c7", color: "#92400e",
                          fontWeight: 600, fontSize: "0.7rem",
                          "& .MuiChip-label": { px: 1 },
                        }} />
                      ) : (
                        <Typography sx={{ fontSize: "0.82rem", color: "#d1d5db" }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#059669" }}>
                        ৳{book.salePrice?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Chip
                        label={book.stock || 0}
                        size="small"
                        sx={{
                          height: 22, fontWeight: 600, fontSize: "0.72rem",
                          bgcolor: (book.stock || 0) <= 5 ? "#fef2f2" : "#ecfdf5",
                          color: (book.stock || 0) <= 5 ? "#dc2626" : "#059669",
                          border: `1px solid ${(book.stock || 0) <= 5 ? "#fecaca" : "#a7f3d0"}`,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 2, py: 1.5 }}>
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                        <Tooltip title="Edit" arrow>
                          <IconButton size="small"
                            onClick={() => { setEditingBook(book); setShowModal(true); }}
                            sx={{ color: "#6366f1", "&:hover": { bgcolor: "#eef2ff" } }}>
                            <Edit sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton size="small"
                            onClick={() => setDeleteConfirm(book._id)}
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

        {/* Footer */}
        {filteredBooks.length > 0 && (
          <Box sx={{
            p: 2, borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              Showing {filteredBooks.length} of {books.length} books
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─────── Add/Edit Book Modal ─────── */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden" } }}
      >
        <AddBookModal
          closeModal={() => { setShowModal(false); fetchBooks(); }}
          editingBook={editingBook}
        />
      </Dialog>

      {/* ─────── Delete Confirmation ─────── */}
      <Dialog
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 400 } }}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: "16px", bgcolor: "#fef2f2",
            display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2,
          }}>
            <Delete sx={{ fontSize: 28, color: "#ef4444" }} />
          </Box>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", mb: 0.5 }}>
            Delete Book?
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 3 }}>
            This action cannot be undone. The book will be permanently removed from your inventory.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
            <Button
              onClick={() => setDeleteConfirm(null)}
              sx={{
                textTransform: "none", borderRadius: "10px", color: "#6b7280",
                fontSize: "0.85rem", fontWeight: 600, px: 3,
                border: "1px solid #e5e7eb",
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBook}
              variant="contained"
              sx={{
                textTransform: "none", borderRadius: "10px",
                fontSize: "0.85rem", fontWeight: 600, px: 3,
                bgcolor: "#ef4444", boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                "&:hover": { bgcolor: "#dc2626", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" },
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

export default AdminBooksPage;
