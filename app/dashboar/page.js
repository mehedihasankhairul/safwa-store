// // app/dashboard/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { Grid, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import { styled } from '@mui/system';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: '1.5rem',
//   backgroundColor: theme.palette.background.default, // Off-white
//   borderRadius: '0.5rem', // Match Tailwind rounded-lg
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', // Subtle shadow
// }));

// export default function Dashboard() {
//   const [books, setBooks] = useState([]);
//   const [orders] = useState([
//     { id: 1, customer: 'রহমান', status: 'Pending', total: 1200 },
//     { id: 2, customer: 'আলী', status: 'Shipped', total: 900 },
//     { id: 3, customer: 'ফাতিমা', status: 'Delivered', total: 1500 },
//   ]);

//   const [sales] = useState({
//     today: 567,
//     week: 4500,
//     month: 25000,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [editingBookId, setEditingBookId] = useState(null);
//   const [newBook, setNewBook] = useState({ title: '', stock: '', price: '', category: '' });
//   const [newStock, setNewStock] = useState('');
//   const [newPrice, setNewPrice] = useState('');
//   const [newCategory, setNewCategory] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showSalesDetails, setShowSalesDetails] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(5);
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [sortField, setSortField] = useState('price');
//   const [sortOrder, setSortOrder] = useState('asc');

//   // Fetch books from API
//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Get API key from environment
//         const headers = {
//           'Authorization': `Bearer ${apiKey}`, // Adjust header format based on your API
//         };

//         const query = new URLSearchParams({
//           page: page.toString(),
//           limit: limit.toString(),
//           category: categoryFilter,
//           sortField,
//           sortOrder,
//         }).toString();

//         const response = await fetch(`http://localhost:8000/api/books?${query}`, { headers });
//         if (!response.ok) throw new Error('বইয়ের তথ্য লোড করতে ত্রুটি হয়েছে।');
//         const data = await response.json();
//         setBooks(data.data || []); // Adjust based on your API response structure
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching books:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [page, limit, categoryFilter, sortField, sortOrder]);

//   // Create a new book
//   const handleAddBook = async () => {
//     if (!newBook.title || !newBook.stock || !newBook.price || !newBook.category) {
//       alert('সব তথ্য পূরণ করুন!');
//       return;
//     }

//     try {
//       const apiKey = process.env.NEXT_PUBLIC_API_KEY;
//       const headers = {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       };

//       const response = await fetch('http://localhost:8000/api/books', {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           title: newBook.title,
//           stock: parseInt(newBook.stock),
//           price: parseInt(newBook.price),
//           category: newBook.category,
//         }),
//       });

//       if (!response.ok) throw new Error('নতুন বই যোগ করতে ত্রুটি হয়েছে।');
//       const data = await response.json();
//       setBooks([...books, data]); // Adjust based on your API response
//       setNewBook({ title: '', stock: '', price: '', category: '' });
//       setShowAddDialog(false);
//       alert('নতুন বই যোগ করা হয়েছে!');
//       // Refresh the list
//       fetchBooks();
//     } catch (err) {
//       setError(err.message);
//       console.error('Error adding book:', err);
//     }
//   };

//   // Update (edit) a book
//   const handleEditBook = (bookId) => {
//     setEditingBookId(bookId);
//     const book = books.find((b) => b.id === bookId);
//     setNewStock(book.stock);
//     setNewPrice(book.price);
//     setNewCategory(book.category || '');
//   };

//   const saveBookChanges = async (bookId) => {
//     if (!newStock || !newPrice) {
//       alert('স্টক এবং মূল্য পূরণ করুন!');
//       return;
//     }

//     try {
//       const apiKey = process.env.NEXT_PUBLIC_API_KEY;
//       const headers = {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       };

//       const response = await fetch(`http://localhost:8000/api/books/${bookId}`, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify({
//           stock: parseInt(newStock),
//           price: parseInt(newPrice),
//           category: newCategory,
//         }),
//       });

//       if (!response.ok) throw new Error('বই আপডেট করতে ত্রুটি হয়েছে।');
//       const updatedBook = await response.json();
//       setBooks(books.map((book) => (book.id === bookId ? updatedBook : book)));
//       setEditingBookId(null);
//       setNewStock('');
//       setNewPrice('');
//       setNewCategory('');
//       alert(`${books.find((b) => b.id === bookId).title} আপডেট সম্পন্ন!`);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error updating book:', err);
//     }
//   };

//   // Delete a book
//   const handleDeleteBook = async (bookId) => {
//     if (confirm(`"${books.find((b) => b.id === bookId)?.title || 'এই বই'}" মুছতে চান?`)) {
//       try {
//         const apiKey = process.env.NEXT_PUBLIC_API_KEY;
//         const headers = {
//           'Authorization': `Bearer ${apiKey}`,
//         };

//         const response = await fetch(`http://localhost:8000/api/books/${bookId}`, {
//           method: 'DELETE',
//           headers,
//         });

//         if (!response.ok) throw new Error('বই মুছতে ত্রুটি হয়েছে।');
//         setBooks(books.filter((book) => book.id !== bookId));
//         alert('বই মুছা হয়েছে!');
//       } catch (err) {
//         setError(err.message);
//         console.error('Error deleting book:', err);
//       }
//     }
//   };

//   const handleOrderDetails = (order) => {
//     setSelectedOrder(order);
//   };

//   const handleSalesReport = () => {
//     setShowSalesDetails(true);
//   };

//   const fetchBooks = async () => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_API_KEY;
//       const headers = {
//         'Authorization': `Bearer ${apiKey}`,
//       };

//       const query = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         category: categoryFilter,
//         sortField,
//         sortOrder,
//       }).toString();

//       const response = await fetch(`http://localhost:8000/api/books?${query}`, { headers });
//       if (!response.ok) throw new Error('বইয়ের তথ্য লোড করতে ত্রুটি হয়েছে।');
//       const data = await response.json();
//       setBooks(data.data || []); // Adjust based on your API response structure
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching books:', err);
//     }
//   };

//   if (loading) return <p className="text-center font-opensans text-book-charcoal">লোড হচ্ছে...</p>;
//   if (error) return <p className="text-center font-opensans text-red-500">{error}</p>;

//   return (
//     <div>
//       <Typography
//         variant="h4"
//         className="mb-6 font-playfair text-book-charcoal"
//       >
//         বইয়ের দোকান ড্যাশবোর্ড
//       </Typography>
//       <Grid container spacing={3}>
//         {/* Sales Stats (Simplified, Mock Data) */}
//         <Grid item xs={12} md={4}>
//           <StyledPaper>
//             <Typography
//               variant="h6"
//               className="font-playfair text-book-maroon mb-2"
//             >
//               আজকের বিক্রয়
//             </Typography>
//             <Typography
//               variant="h3"
//               className="font-opensans text-book-charcoal"
//             >
//               ৫৬৭৳
//             </Typography>
//             <Button
//               variant="text"
//               onClick={handleSalesReport}
//               className="mt-2 text-book-gold hover:text-book-maroon transition-colors"
//             >
//               বিক্রয় রিপোর্ট
//             </Button>
//             {showSalesDetails && (
//               <div className="mt-2">
//                 <Typography className="font-opensans text-book-charcoal">
//                   আজকের বিক্রয়: ৫৬৭৳, সপ্তাহের: ৪,৫০০৳, মাসের: ২৫,০০০৳
//                 </Typography>
//                 <Button
//                   variant="text"
//                   onClick={() => setShowSalesDetails(false)}
//                   className="mt-2 text-book-gold hover:text-book-maroon transition-colors"
//                 >
//                   লুকান
//                 </Button>
//               </div>
//             )}
//           </StyledPaper>
//         </Grid>

//         {/* Book Inventory */}
//         <Grid item xs={12}>
//           <StyledPaper>
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <Typography
//                   variant="h5"
//                   className="font-playfair text-book-maroon"
//                 >
//                   বইয়ের ইনভেন্টরি
//                 </Typography>
//                 <TextField
//                   label="শ্রেণী দ্বারা ফিল্টার"
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   variant="outlined"
//                   size="small"
//                   className="mt-2 w-64"
//                 />
//               </div>
//               <Button
//                 variant="contained"
//                 onClick={() => setShowAddDialog(true)}
//                 className="bg-book-maroon text-white hover:bg-book-gold"
//               >
//                 নতুন বই যোগ করুন
//               </Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {books.map((book) => (
//                 <div key={book.id} className="p-4 bg-white rounded-lg shadow-sm">
//                   <Typography
//                     variant="h6"
//                     className="font-playfair text-book-charcoal"
//                   >
//                     {book.title}
//                   </Typography>
//                   <Typography
//                     className="font-opensans text-book-charcoal"
//                   >
//                     স্টক: {book.stock} | মূল্য: ৳{book.price} | শ্রেণী: {book.category || 'নির্দিষ্ট নেই'}
//                   </Typography>
//                   {editingBookId === book.id ? (
//                     <div className="mt-2">
//                       <TextField
//                         label="নতুন স্টক"
//                         type="number"
//                         value={newStock}
//                         onChange={(e) => setNewStock(e.target.value)}
//                         variant="outlined"
//                         size="small"
//                         className="mb-2"
//                       />
//                       <TextField
//                         label="নতুন মূল্য"
//                         type="number"
//                         value={newPrice}
//                         onChange={(e) => setNewPrice(e.target.value)}
//                         variant="outlined"
//                         size="small"
//                         className="mb-2"
//                       />
//                       <TextField
//                         label="শ্রেণী"
//                         value={newCategory}
//                         onChange={(e) => setNewCategory(e.target.value)}
//                         variant="outlined"
//                         size="small"
//                         className="mb-2"
//                       />
//                       <Button
//                         variant="text"
//                         onClick={() => saveBookChanges(book.id)}
//                         className="text-book-gold hover:text-book-maroon"
//                       >
//                         সংরক্ষণ করুন
//                       </Button>
//                       <Button
//                         variant="text"
//                         onClick={() => setEditingBookId(null)}
//                         className="ml-2 text-book-gold hover:text-book-maroon"
//                       >
//                         বাতিল
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="mt-2 flex space-x-2">
//                       <Button
//                         variant="text"
//                         onClick={() => handleEditBook(book.id)}
//                         className="text-book-gold hover:text-book-maroon transition-colors"
//                       >
//                         এডিট করুন
//                       </Button>
//                       <Button
//                         variant="text"
//                         onClick={() => handleDeleteBook(book.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         মুছুন
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             {/* Pagination Controls */}
//             <div className="mt-4 flex justify-between">
//               <div>
//                 <Button
//                   variant="text"
//                   onClick={() => setPage(page - 1)}
//                   disabled={page === 1}
//                   className="text-book-gold hover:text-book-maroon"
//                 >
//                   পূর্ববর্তী
//                 </Button>
//                 <span className="mx-2 font-opensans text-book-charcoal">
//                   পৃষ্ঠা {page}
//                 </span>
//                 <Button
//                   variant="text"
//                   onClick={() => setPage(page + 1)}
//                   disabled={books.length < limit}
//                   className="text-book-gold hover:text-book-maroon"
//                 >
//                   পরবর্তী
//                 </Button>
//               </div>
//               <TextField
//                 label="প্রতি পৃষ্ঠার আইটেম"
//                 type="number"
//                 value={limit}
//                 onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
//                 variant="outlined"
//                 size="small"
//                 className="w-32"
//               />
//             </div>
//             {/* Sorting Controls */}
//             <div className="mt-4">
//               <TextField
//                 label="সাজানোর ক্ষেত্র"
//                 value={sortField}
//                 onChange={(e) => setSortField(e.target.value)}
//                 variant="outlined"
//                 size="small"
//                 className="mr-2"
//               />
//               <TextField
//                 label="সাজানোর ক্রম"
//                 value={sortOrder}
//                 onChange={(e) => setSortOrder(e.target.value)}
//                 variant="outlined"
//                 size="small"
//                 className="mr-2"
//               />
//               <Button
//                 variant="text"
//                 onClick={fetchBooks}
//                 className="text-book-gold hover:text-book-maroon"
//               >
//                 সাজানো প্রয়োগ করুন
//               </Button>
//             </div>
//           </StyledPaper>
//         </Grid>

//         {/* Orders (Simplified, Mock Data) */}
//         <Grid item xs={12}>
//           <StyledPaper>
//             <Typography
//               variant="h5"
//               className="font-playfair text-book-maroon mb-4"
//             >
//               অর্ডারসমূহ
//             </Typography>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {orders.map((order) => (
//                 <div key={order.id} className="p-4 bg-white rounded-lg shadow-sm">
//                   <Typography
//                     variant="h6"
//                     className="font-playfair text-book-charcoal"
//                   >
//                     {order.customer}
//                   </Typography>
//                   <Typography
//                     className="font-opensans text-book-charcoal"
//                   >
//                     স্থিতি: {order.status} | মোট: ৳{order.total}
//                   </Typography>
//                   <Button
//                     variant="text"
//                     onClick={() => handleOrderDetails(order)}
//                     className="mt-2 text-book-gold hover:text-book-maroon transition-colors"
//                   >
//                     বিস্তারিত
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </StyledPaper>
//         </Grid>
//       </Grid>

//       {/* Add Book Dialog */}
//       <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
//         <DialogTitle className="font-playfair text-book-maroon">
//           নতুন বই যোগ করুন
//         </DialogTitle>
//         <DialogContent>
//           <div className="font-opensans text-book-charcoal">
//             <TextField
//               label="বইয়ের নাম"
//               value={newBook.title}
//               onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
//               variant="outlined"
//               fullWidth
//               className="mb-2"
//             />
//             <TextField
//               label="স্টক"
//               type="number"
//               value={newBook.stock}
//               onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
//               variant="outlined"
//               fullWidth
//               className="mb-2"
//             />
//             <TextField
//               label="মূল্য (৳)"
//               type="number"
//               value={newBook.price}
//               onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
//               variant="outlined"
//               fullWidth
//               className="mb-2"
//             />
//             <TextField
//               label="শ্রেণী"
//               value={newBook.category}
//               onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
//               variant="outlined"
//               fullWidth
//               className="mb-2"
//             />
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setShowAddDialog(false)}
//             className="text-book-gold hover:text-book-maroon"
//           >
//             বাতিল
//           </Button>
//           <Button
//             onClick={handleAddBook}
//             className="text-book-gold hover:text-book-maroon"
//           >
//             যোগ করুন
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Order Details Dialog */}
//       <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
//         <DialogTitle className="font-playfair text-book-maroon">
//           অর্ডার বিস্তারিত
//         </DialogTitle>
//         <DialogContent>
//           {selectedOrder && (
//             <div className="font-opensans text-book-charcoal">
//               <Typography>কাস্টমার: {selectedOrder.customer}</Typography>
//               <Typography>স্থিতি: {selectedOrder.status}</Typography>
//               <Typography>মোট: ৳{selectedOrder.total}</Typography>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setSelectedOrder(null)}
//             className="text-book-gold hover:text-book-maroon"
//           >
//             বন্ধ করুন
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }