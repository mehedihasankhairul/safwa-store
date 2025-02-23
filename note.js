"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useBookStore from "@/store/bookStore";
import Image from "next/image";

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
  const [successMessage, setSuccessMessage] = useState("");

  const authToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  // ✅ Calculate Sale Price Dynamically
  const discountedPrice = Math.round(
    bookData.printedPrice
      ? bookData.printedPrice - (bookData.printedPrice * (bookData.discount || 0)) / 100
      : 0
  );




  // ✅ Validate Form
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

  // ✅ Handle File Change (Multiple Images)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    // ✅ Validate File Type & Size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxSize
    );

    if (validFiles.length !== files.length) {
      alert("Some files were rejected! Allowed types: JPG, PNG, WEBP. Max size: 5MB.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("coverImgs", file));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/upload-cover`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = async function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setBookData((prev) => ({ ...prev, coverImgs: data.imageUrls }));
          setCoverPreviews(data.imageUrls);
        } else {
          console.error("Image upload failed");
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Image upload error:", error);
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
    // Close modal after showing success message
    setTimeout(() => {
      setSuccessMessage("");
      closeModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        {/* ✅ Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
          </div>
        )
        }

        {/* ✅ Success Message */}
        {successMessage && <p className="text-green-600 font-semibold text-center">{successMessage}</p>}

        {/* ✅ Scrollable Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              name="title"
              className="border p-2 w-full rounded-md"
              value={bookData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="text-sm font-medium text-gray-700">Author *</label>
            <input
              type="text"
              name="author"
              className="border p-2 w-full rounded-md"
              value={bookData.author}
              onChange={handleChange}
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
          </div>

          {/* Translated By */}
          <div>
            <label className="text-sm font-medium text-gray-700">Translated By</label>
            <input
              type="text"
              name="translatedBy"
              className="border p-2 w-full rounded-md"
              value={bookData.translatedBy}
              onChange={handleChange}
            />
          </div>

          {/* Publication */}
          <div>
            <label className="text-sm font-medium text-gray-700">Publication</label>
            <input
              type="text"
              name="publication"
              className="border p-2 w-full rounded-md"
              value={bookData.publication}
              onChange={handleChange}
            />
          </div>

          {/* Printed Price */}
          <div>
            <label className="text-sm font-medium text-gray-700">Printed Price (৳) *</label>
            <input
              type="number"
              name="printedPrice"
              className="border p-2 w-full rounded-md"
              value={bookData.printedPrice}
              onChange={handleChange}
            />
            {errors.printedPrice && <p className="text-red-500 text-sm">{errors.printedPrice}</p>}
          </div>

          {/* Discount */}
          <div>
            <label className="text-sm font-medium text-gray-700">Discount (%)</label>
            <input
              type="number"
              min={0}
              name="discount"
              className="border p-2 w-full rounded-md"
              value={bookData.discount}
              onChange={handleChange}
            />
            {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
          </div>

          {/* Auto-Calculated Sale Price */}
          <div>
            <label className="text-sm font-medium text-gray-700">Sale Price (৳)</label>
            <input type="number" className="border p-2 w-full bg-gray-100 rounded-md" value={discountedPrice} disabled />
          </div>

          {/* Stock */}
          <div>
            <label className="text-sm font-medium text-gray-700">Stock *</label>
            <input
              type="number"
              name="stock"
              min={0}
              className="border p-2 w-full rounded-md"
              value={bookData.stock}
              onChange={handleChange}
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
          </div>


          {/* Cover Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">Book Cover Image</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="border p-2 w-full rounded-md" />
            {/* ✅ Image Preview */}
            <div className="flex gap-2">
              {coverPreviews.map((url, index) => (
                <Image key={index} src={url} width={80} height={100} alt="Cover Preview" className="rounded-md shadow-md" />
              ))}
            </div>
          </div>

          {/* ✅ Submit Button with Loading Spinner */}
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
