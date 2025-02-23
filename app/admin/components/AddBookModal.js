"use client";
import { useState } from "react";
import { DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, LinearProgress } from "@mui/material";
import useBookStore from "@/store/bookStore";

const categories = ["Fiction", "Non-Fiction", "Education", "Islamic", "Comics"]; // Example categories

const AddBookModal = ({ closeModal }) => {
  const { addBook } = useBookStore();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const authToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  // ✅ Calculate Sale Price Dynamically
  const discountedPrice = Math.round(
    bookData.printedPrice
      ? bookData.printedPrice - (bookData.printedPrice * (bookData.discount || 0)) / 100
      : 0
  );

  // ✅ Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!bookData.title) newErrors.title = "Title is required";
    if (!bookData.author) newErrors.author = "Author is required";
    if (!bookData.category) newErrors.category = "Category is required";
    if (!bookData.printedPrice || bookData.printedPrice <= 0)
      newErrors.printedPrice = "Printed Price must be greater than 0";
    if (bookData.discount < 0 || bookData.discount > 100)
      newErrors.discount = "Discount must be between 0-100%";
    if (bookData.stock < 0) newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  // ✅ Handle Image Upload (Multiple)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append("coverImgs", file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/upload-cover`, {
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

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    await addBook(bookData, authToken);
    setLoading(false);
    closeModal();
  };

  return (
    <>
      <DialogTitle>Add New Book</DialogTitle>
      <DialogContent dividers>
        <TextField label="Title" name="title" fullWidth margin="dense" value={bookData.title} onChange={handleChange} error={!!errors.title} helperText={errors.title} />
        <TextField label="Author" name="author" fullWidth margin="dense" value={bookData.author} onChange={handleChange} error={!!errors.author} helperText={errors.author} />
        <TextField label="Translated By" name="translatedBy" fullWidth margin="dense" value={bookData.translatedBy} onChange={handleChange} />
        <TextField label="Publication" name="publication" fullWidth margin="dense" value={bookData.publication} onChange={handleChange} />
        <TextField label="Category" name="category" select fullWidth margin="dense" value={bookData.category} onChange={handleChange} error={!!errors.category} helperText={errors.category}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
        {loading && <LinearProgress />}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          Add Book
        </Button>
      </DialogActions>
    </>
  );
};

export default AddBookModal;
