import { create } from "zustand";

const useBookStore = create((set, get) => ({
  books: [],
  totalPages: 1,
  currentPage: 1,

  // ✅ Fetch All Books
  fetchBooks: async (page = 1) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books?page=${page}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch books");

      if (Array.isArray(data.books)) {
        set({ books: data.books, totalPages: data.totalPages, currentPage: data.page });
      } else {
        console.error("Books response is not an array:", data);
        set({ books: [] });
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
      set({ books: [] });
    }
  },

  // ✅ Add New Book (Admin Only)
  addBook: async (bookData, authToken) => {
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach((key) => formData.append(key, bookData[key]));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add book");

      set((state) => ({ books: [result.book, ...state.books] }));

      return { success: true, message: "Book added successfully" }; // ✅ Return success message
    } catch (error) {
      console.error("Failed to add book:", error);
      return { success: false, message: error.message || "Failed to add book" }; // ✅ Return error message
    }
  },

  // ✅ Update Book (Admin Only)
  updateBook: async (bookId, updatedData, authToken) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => formData.append(key, updatedData[key]));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update book");

      set((state) => ({
        books: state.books.map((book) => (book._id === bookId ? result.book : book)),
      }));

      return { success: true, message: "Book updated successfully" }; // ✅ Return success message
    } catch (error) {
      console.error("Failed to update book:", error);
      return { success: false, message: error.message || "Failed to update book" }; // ✅ Return error message
    }
  },

  // ✅ Delete Book (Admin Only)
  deleteBook: async (bookId, authToken) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete book");
      }

      if (response.ok) {
        set((state) => ({
          books: state.books.filter((book) => book._id !== bookId),
        }));
        alert("Book deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  },
}));

export default useBookStore;
