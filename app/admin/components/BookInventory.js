"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Button, Dialog } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import useBookStore from "@/store/bookStore";
import Image from "next/image";
import AddBookModal from "./AddBookModal"; // Import AddBookModal component

export default function BookInventory() {
  const { books, fetchBooks, deleteBook } = useBookStore();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      await fetchBooks();
      setLoading(false);
    };

    loadBooks();
  },);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id);
    }
  };

  if (loading) return <p>Loading books...</p>;

  return (
    <>
      {/* Add Book Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        Add Book
      </Button>

      {/* Book Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Printed Price</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <Image src={book.coverImgs?.[0] || "/placeholder.jpg"} alt={book.title} width={50} height={70} />
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>৳ {book.printedPrice}</TableCell>
                <TableCell>৳ {book.salePrice}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(book._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Book Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <AddBookModal closeModal={() => setOpenModal(false)} />
      </Dialog>
    </>
  );
}
