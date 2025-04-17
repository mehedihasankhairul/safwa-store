// const BASE_URL = "https://bookshop-management-backend.onrender.com/api";
const BASE_URL = "https://api-safwa-store.vercel.app/api";

// Fetch all books for the "সকল বই" section
export const getAllBooksForAllSection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    if (!response.ok) throw new Error(`Failed to fetch books: ${response.statusText}`);
    const data = await response.json();
    return data.books; // Return only the books array
  } catch (error) {
    console.error("Error fetching all books:", error);
    return [];
  }
};

// Fetch all books with optional query parameters (e.g., pagination, sorting, etc.)
export const getAllBooks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/books?${queryString}`);
    if (!response.ok) throw new Error(`Failed to fetch books: ${response.statusText}`);
    const data = await response.json();
    return data; // Return the entire response for pagination and metadata

  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
};

// Add a new book (Admin-only, requires a token)
export const addBook = async (book, token) => {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error(`Failed to add book: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding book:", error);
    return null;
  }
};

// Fetch books by category with optional query parameters
export const getBooksByCategory = async (category, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${BASE_URL}/books?category=${encodeURIComponent(category)}&${queryString}`
    );
    if (!response.ok) throw new Error("Failed to fetch books by category");
    const data = await response.json();
    return data.books; // Return only the books array
  } catch (error) {
    console.error("Error fetching books by category:", error);
    return [];
  }
};

// Fetch a single book by ID
export const getBookById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch book: ${response.statusText}`);
    const data = await response.json();
    return data; // Return the book details
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
};

// Update a book by ID (Admin-only, requires a token)
export const updateBook = async (id, updatedBook, token) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBook),
    });
    if (!response.ok) throw new Error(`Failed to update book: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
};

// Delete a book by ID (Admin-only, requires a token)
export const deleteBook = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Failed to delete book: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting book:", error);
    return null;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`);

    const data = await response.json();
    return data; // This should return the created order, including the order ID
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};
