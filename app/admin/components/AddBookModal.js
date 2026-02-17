"use client";
import { useState, useEffect } from "react";
import {
  DialogContent, DialogActions, Button, TextField, MenuItem,
  LinearProgress, Box, Typography, IconButton, Chip
} from "@mui/material";
import { Close, CloudUpload, MenuBook, Add, Save } from "@mui/icons-material";
import useBookStore from "@/store/bookStore";
import useAuthStore from "@/store/authStore";

const categories = ["Fiction", "Non-Fiction", "Education", "Islamic", "Comics"];

const AddBookModal = ({ closeModal, editingBook }) => {
  const { addBook, updateBook } = useBookStore();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    translatedBy: "",
    publication: "",
    category: "",
    printedPrice: "",
    discount: 0,
    stock: 1,
    format: "Paperback",
    coverImgs: [],
  });
  const [coverPreviews, setCoverPreviews] = useState([]);

  const { token } = useAuthStore();
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const isEditing = Boolean(editingBook);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingBook) {
      setBookData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        translatedBy: editingBook.translatedBy || "",
        publication: editingBook.publication || "",
        category: editingBook.category || "",
        printedPrice: editingBook.printedPrice || "",
        discount: editingBook.discount || 0,
        stock: editingBook.stock || 1,
        format: editingBook.format || "Paperback",
        coverImgs: editingBook.coverImgs || [],
      });
      if (editingBook.coverImgs?.length > 0) {
        setCoverPreviews(editingBook.coverImgs);
      }
    }
  }, [editingBook]);

  const discountedPrice = Math.round(
    bookData.printedPrice
      ? bookData.printedPrice - (bookData.printedPrice * (bookData.discount || 0)) / 100
      : 0
  );

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.title) newErrors.title = "Title is required";
    if (!bookData.author) newErrors.author = "Author is required";
    if (!bookData.category) newErrors.category = "Category is required";
    if (!bookData.printedPrice || bookData.printedPrice <= 0)
      newErrors.printedPrice = "Price must be greater than 0";
    if (bookData.discount < 0 || bookData.discount > 100)
      newErrors.discount = "Must be 0-100%";
    if (bookData.stock < 0) newErrors.stock = "Cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("coverImgs", file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books/upload-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
      const data = await res.json();
      setBookData((prev) => ({ ...prev, coverImgs: data.imageUrls }));
      setCoverPreviews(data.imageUrls);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    if (isEditing) {
      await updateBook(editingBook._id, bookData, authToken);
    } else {
      await addBook(bookData, authToken);
    }
    setLoading(false);
    closeModal();
  };

  // Shared text field style
  const tfSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px", fontSize: "0.88rem",
      "& fieldset": { borderColor: "#e5e7eb" },
      "&:hover fieldset": { borderColor: "#d1d5db" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1.5 },
    },
    "& .MuiInputLabel-root": { fontSize: "0.88rem" },
  };

  return (
    <>
      {/* Header */}
      <Box sx={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        px: 3, py: 2.5, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MenuBook sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {isEditing ? "Edit Book" : "Add New Book"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.7 }}>
              {isEditing ? "Update book information" : "Fill in the book details below"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeModal} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}>
          <Close />
        </IconButton>
      </Box>

      {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #6366f1, #8b5cf6)" } }} />}

      <DialogContent sx={{ p: 3 }}>
        {/* Book Info */}
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", mb: 1.5 }}>
          Book Information
        </Typography>

        <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
          <TextField label="Title" name="title" fullWidth value={bookData.title} onChange={handleChange}
            error={!!errors.title} helperText={errors.title} sx={tfSx} />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Author" name="author" fullWidth value={bookData.author} onChange={handleChange}
              error={!!errors.author} helperText={errors.author} sx={tfSx} />
            <TextField label="Translated By" name="translatedBy" fullWidth value={bookData.translatedBy}
              onChange={handleChange} sx={tfSx} />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="Publication" name="publication" fullWidth value={bookData.publication}
              onChange={handleChange} sx={tfSx} />
            <TextField label="Category" name="category" select fullWidth value={bookData.category}
              onChange={handleChange} error={!!errors.category} helperText={errors.category} sx={tfSx}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* Pricing */}
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", mb: 1.5 }}>
          Pricing & Stock
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
          <TextField label="Printed Price (৳)" name="printedPrice" type="number" fullWidth value={bookData.printedPrice}
            onChange={handleChange} error={!!errors.printedPrice} helperText={errors.printedPrice} sx={tfSx} />
          <TextField label="Discount (%)" name="discount" type="number" fullWidth value={bookData.discount}
            onChange={handleChange} error={!!errors.discount} helperText={errors.discount}
            inputProps={{ min: 0, max: 100 }} sx={tfSx} />
          <TextField label="Stock" name="stock" type="number" fullWidth value={bookData.stock}
            onChange={handleChange} error={!!errors.stock} helperText={errors.stock}
            inputProps={{ min: 0 }} sx={tfSx} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <TextField label="Format" name="format" select fullWidth value={bookData.format} onChange={handleChange} sx={tfSx}>
            <MenuItem value="Paperback">Paperback</MenuItem>
            <MenuItem value="Hardcover">Hardcover</MenuItem>
            <MenuItem value="E-book">E-book</MenuItem>
          </TextField>
          <Box sx={{
            display: "flex", alignItems: "center", p: 2,
            bgcolor: "#ecfdf5", borderRadius: "10px", border: "1px solid #a7f3d0",
          }}>
            <Box>
              <Typography sx={{ fontSize: "0.7rem", color: "#059669", fontWeight: 500 }}>Sale Price</Typography>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#059669" }}>৳{discountedPrice}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Cover Upload */}
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", mb: 1.5 }}>
          Cover Images
        </Typography>

        <Box sx={{
          border: "2px dashed #e5e7eb", borderRadius: "12px", p: 3,
          textAlign: "center", cursor: "pointer", transition: "all 0.2s",
          "&:hover": { borderColor: "#6366f1", bgcolor: "#fafafe" },
        }}
          onClick={() => document.getElementById("cover-upload").click()}
        >
          <CloudUpload sx={{ fontSize: 36, color: "#9ca3af", mb: 1 }} />
          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
            Click to upload cover images
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#d1d5db" }}>
            PNG, JPG up to 5MB each
          </Typography>
          <input id="cover-upload" type="file" accept="image/*" multiple onChange={handleFileChange}
            style={{ display: "none" }} />
        </Box>

        {coverPreviews.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            {coverPreviews.map((url, index) => (
              <Box key={index} sx={{
                width: 56, height: 72, borderRadius: "8px", overflow: "hidden",
                border: "2px solid #eef2ff", position: "relative",
              }}>
                <img src={url} alt={`Cover ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <Box sx={{
        px: 3, py: 2, borderTop: "1px solid #f3f4f6",
        display: "flex", gap: 1.5, justifyContent: "flex-end",
      }}>
        <Button onClick={closeModal} sx={{
          textTransform: "none", borderRadius: "10px", color: "#6b7280",
          fontSize: "0.85rem", fontWeight: 600, px: 3,
          border: "1px solid #e5e7eb",
          "&:hover": { bgcolor: "#f3f4f6" },
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={isEditing ? <Save sx={{ fontSize: 16 }} /> : <Add sx={{ fontSize: 16 }} />}
          sx={{
            textTransform: "none", borderRadius: "10px",
            fontSize: "0.85rem", fontWeight: 600, px: 3,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            },
          }}
        >
          {isEditing ? "Save Changes" : "Add Book"}
        </Button>
      </Box>
    </>
  );
};

export default AddBookModal;
