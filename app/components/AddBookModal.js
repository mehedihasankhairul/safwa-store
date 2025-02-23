"use client";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import useBookStore from "@/store/bookStore";
import Image from "next/image";

const AddBookModal = ({ closeModal, editingBook }) => {
  const { addBook, updateBook } = useBookStore();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverPreviews, setCoverPreviews] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Pre-fill fields if editingBook exists
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    translatedBy: "",
    publication: "",
    category: "",
    printedPrice: "",
    discount: 0,  // ✅ Included Discount Field
    salePrice: 0,
    stock: 1,
    format: "Paperback",
    coverImgs: [],
  });

  const authToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  // ✅ Set pre-filled data when editingBook changes
  useEffect(() => {
    if (editingBook) {
      setBookData({ ...editingBook });
      setCoverPreviews(editingBook.coverImgs || []);
    }
  }, [editingBook]);

  // ✅ Automatically update salePrice when printedPrice or discount changes
  useEffect(() => {
    if (bookData.printedPrice) {
      const calculatedPrice = Math.round(
        bookData.printedPrice - (bookData.printedPrice * (bookData.discount || 0)) / 100
      );

      setBookData((prev) => ({
        ...prev,
        salePrice: calculatedPrice > 0 ? calculatedPrice : 0, // Prevent negative salePrice
      }));
    }
  }, [bookData.printedPrice, bookData.discount]);  // ✅ Ensure discount triggers recalculation

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
    if (bookData.salePrice < 0) newErrors.salePrice = "Sale Price cannot be negative";
    if (bookData.stock < 0) newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  // ✅ Handle File Change (Multiple Images Upload to Cloudinary)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );

    if (validFiles.length !== files.length) {
      alert("Some files were rejected! Allowed: JPG, PNG, WEBP (Max: 5MB)");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // ✅ Show Local Image Previews Before Upload
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setCoverPreviews((prev) => [...prev, ...newPreviews]);

    // ✅ Upload to Cloudinary
    const formData = new FormData();
    validFiles.forEach((file) => formData.append("coverImgs", file));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/upload-cover`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.imageUrls) {
        setBookData((prev) => ({
          ...prev,
          coverImgs: [...prev.coverImgs, ...data.imageUrls],
        }));
        setSuccessMessage(`✅ ${data.imageUrls.length} Images Uploaded`);
      } else {
        alert("Image Upload Failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Image Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle Submit (Add or Update Book)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    if (editingBook) {
      // ✅ Update Book
      await updateBook(editingBook._id, bookData, authToken);
    } else {
      // ✅ Add New Book
      await addBook(bookData, authToken);
    }

    setLoading(false);
    setTimeout(() => {
      setSuccessMessage("");
      closeModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editingBook ? "✏️ Edit Book" : "📚 Add New Book"}
          </h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        {/* ✅ Success Message */}
        {successMessage && <p className="text-green-600 font-semibold text-center">{successMessage}</p>}

        {/* ✅ Scrollable Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["title", "author", "translatedBy", "publication", "category", "printedPrice", "stock"].map(
            (field) => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, " $1")} *</label>
                <input
                  type={field.includes("Price") || field.includes("discount") || field.includes("stock") ? "number" : "text"}
                  name={field}
                  className="border p-2 w-full rounded-md"
                  onWheel={(e) => e.target.blur()}
                  value={bookData[field]}
                  onChange={handleChange}
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}

                {/* Printed Price & Discount */}
                {field === "printedPrice" && (
                  <div className="flex items-center gap-2 mt-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        className="border p-2 w-full rounded-md"
                        min={field === "discount" ? 0 : 1}
                        value={bookData.discount}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sale Price</label>
                      <input
                        type="number"
                        className="border p-2 w-full bg-gray-100 rounded-md"
                        value={bookData.salePrice}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* Format Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">Format</label>
            <select
              name="format"
              className="border p-2 w-full rounded-md"
              value={bookData.format}
              onChange={handleChange}
            >
              <option value="Paperback">Paperback</option>
              <option value="Hardcover">Hardcover</option>
            </select>
          </div>

         

          {/* Cover Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">Upload Cover Images</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="border p-2 w-full rounded-md" />
            <div className="flex gap-2 mt-2">
              {coverPreviews.map((url, index) => (
                <Image key={index} src={url} width={80} height={100} alt="Cover Preview" className="rounded-md shadow-md" />
              ))}
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full">
            {loading ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
