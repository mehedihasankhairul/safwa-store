"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import useBookStore from "@/store/bookStore";
import AddBookModal from "../../components/AddBookModal";

const AdminBooksPage = () => {
  const { books, fetchBooks, deleteBook } = useBookStore();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      await fetchBooks();
      setLoading(false);
    };
    loadBooks();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Books</h1>

      {/* ✅ Add Book Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Book
        </button>
      </div>

      {/* ✅ Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left hidden md:table-cell">Category</th>
              <th className="p-3 text-left">Printed Price</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Sale Price</th>
              <th className="p-3 text-left hidden md:table-cell">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-3">Loading books...</td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-3">No books found.</td>
              </tr>
            ) : (
              books.map((book, index) => (
                <tr key={book._id || index} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    <img
                      src={book.coverImg || "/default-cover.png"}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3 hidden md:table-cell">{book.category}</td>
                  <td className="p-3">৳{book.printedPrice}</td>
                  <td className="p-3">{book.discount}%</td>
                  <td className="p-3 text-green-600 font-bold">৳{book.salePrice}</td>
                  <td className="p-3 hidden md:table-cell">{book.stock}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center">
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Add Book Modal */}
      {showModal && <AddBookModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default AdminBooksPage;
