const BASE_URL = "https://bookshop-management-backend.onrender.com/api";

export const getAllBooks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/books?${queryString}`);
    if (!response.ok) throw new Error(`Failed to fetch books: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return null;
  }
};

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

export const getBooksByCategory = async (category, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${BASE_URL}/books?category=${category}&${queryString}`
    );
    if (!response.ok) throw new Error("Failed to fetch books");
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error("Error fetching books by category:", error);
    return [];
  }
};
