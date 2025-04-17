"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  Avatar,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import useBookStore from "@/store/bookStore";
import AddBookModal from "../../components/AddBookModal";
import Image from "next/image";
import dummyCover from "../../../public/assets/dummy.png";

const AdminBooksPage = () => {
  const { books, fetchBooks, deleteBook, updateBook } = useBookStore();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // Stores book being edited
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores book being deleted
  const [isClient, setIsClient] = useState(false); // Track if it's client-side render

  useEffect(() => {
    const loadBooks = async () => {
      await fetchBooks();
      setLoading(false);
    };
    loadBooks();

    // Set `isClient` to true to indicate that the component is rendered on the client side
    setIsClient(true);
  }, []);

  // ✅ Handle Delete Confirmation
  const handleDeleteBook = async () => {
    if (deleteConfirm) {
      await deleteBook(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <Card sx={{ padding: 3, margin: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          Admin Books Management
        </Typography>

        {/* ✅ Add Book Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => {
            setEditingBook(null); // Reset editing
            setShowModal(true);
          }}
          sx={{ marginBottom: 2 }}
        >
          Add Book
        </Button>

        {/* ✅ Responsive Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Printed Price</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center">Sale Price</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book, index) => (
                  <TableRow key={book._id || `book-${index}`}>
                    <TableCell>
                      {isClient ? (
                        book.coverImgs && book.coverImgs.length > 0 ? (
                          <Image
                            src={book.coverImgs[0]} // Show first cover image
                            alt={book.title}
                            width={50}
                            height={70}
                            className="rounded-md shadow-md object-cover"
                          />
                        ) : (
                          <Avatar
                            src={book.coverImg ? book.coverImg : dummyCover}
                            alt={book.title}
                            variant="rounded"
                            sx={{ width: 50, height: 70 }}
                          />
                        )
                      ) : (
                        <div>Loading...</div>
                      )}
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell align="center">{book.category}</TableCell>
                    <TableCell align="center">৳{book.printedPrice}</TableCell>
                    <TableCell align="center">{book.discount}%</TableCell>
                    <TableCell align="center" sx={{ color: "green", fontWeight: "bold" }}>
                      ৳{book.salePrice}
                    </TableCell>
                    <TableCell align="center">{book.stock}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setEditingBook(book);
                          setShowModal(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteConfirm(book._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      {/* ✅ Add / Edit Book Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <AddBookModal
          closeModal={() => setShowModal(false)}
          editingBook={editingBook} // Pass book data for editing
        />
      </Dialog>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteBook}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AdminBooksPage;
