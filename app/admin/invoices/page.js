"use client";

import { useEffect, useState } from "react";
import { FaEye, FaEnvelope, FaSync, FaDownload, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import Link from "next/link";

const AdminInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
 

  // ✅ Fetch all invoices for admin
  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/admin/invoices`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      const data = await response.json();
      setInvoices(data);
      
    } catch (error) {
      console.error("Failed to fetch admin invoices:", error);
    } finally {
      setLoading(false);
    }
  };

 

  // ✅ Fetch invoice details for preview
  const fetchAdminInvoice = async (orderId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/admin/invoices/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);

      const invoiceData = await response.json();
      setSelectedInvoice(invoiceData); // ✅ Ensure invoice is set correctly
    } catch (error) {
      console.error("Failed to fetch admin invoice:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  


  // ✅ Send invoice email
  const sendInvoiceEmail = async (orderId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/send-email/${orderId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Invoice email sent successfully!");
    } catch (error) {
      console.error("Failed to send invoice email:", error);
    }
  };

  const deleteInvoice = async (orderId) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/admin/invoices/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);

      alert("Invoice deleted successfully!");
      fetchInvoices(); // ✅ Refresh the invoices list
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Invoices</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-center text-gray-600">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Total Amount</th>
                <th className="p-4 text-left">Order Date</th>
                <th className="p-4 text-left">Payment Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.orderId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono">{invoice.orderId}</td>
                  <td className="p-4">{invoice.userName || "N/A"}</td>
                  <td className="p-4 font-semibold">৳{invoice.totalAmount.toFixed(2)}</td>
                  <td className="p-4">{invoice.orderDate?.split("T")[0]}</td>
                  <td className="p-4 items-center">
                    {invoice.paymentStatus === "Paid" ? (
                      <span className="bg-green-200 text-green-700 px-3 py-1 rounded-md flex items-center">
                        <FaCheckCircle className="mr-2" /> Paid
                      </span>
                    ) : (
                      <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-md flex items-center">
                        <FaTimesCircle className="mr-2" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => fetchAdminInvoice(invoice.orderId)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      <FaEye className="mr-2" />
                    </button>
                    <button
                      onClick={() => sendInvoiceEmail(invoice.orderId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      <FaEnvelope className="mr-2" />
                    </button>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}${invoice.invoiceUrl}`}
                      target="_blank"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      <FaDownload className="mr-2" />
                    </Link>
                    <button
                      onClick={() => deleteInvoice(invoice.orderId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      <FaTrash className="mr-2" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Invoice Preview</h2>
            <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
            <p><strong>Total Amount:</strong> ৳{selectedInvoice.totalAmount.toFixed(2)}</p>
            <p><strong>Order Date:</strong> {new Date(selectedInvoice.orderDate).toLocaleString()}</p>
            <p>
              <strong>Payment Status:</strong>
              <span className={`px-2 py-1 rounded-md ${selectedInvoice.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {selectedInvoice.paymentStatus}
              </span>
            </p>
            <h3 className="text-lg font-semibold mt-4">Customer Details:</h3>
            <p><strong>Name:</strong> {selectedInvoice.userName}</p>
            <p><strong>Email:</strong> {selectedInvoice.email}</p>
            <p><strong>Phone:</strong> {selectedInvoice.phone}</p>
            <p><strong>Address:</strong> {selectedInvoice.fullAddress}</p>
            <h3 className="text-lg font-semibold mt-4">Books Ordered:</h3>
            <ul className="border rounded-md p-3 mt-2 bg-gray-50">
              {selectedInvoice.books?.length > 0 ? (
                selectedInvoice.books.map((book, index) => (
                  <li key={index} className="flex justify-between text-gray-700 py-1">
                    <span>{book.title} (x{book.quantity})</span>
                    <span>৳{book.price}</span>
                  </li>
                ))
              ) : (
                <p>No books found.</p>
              )}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <Link
                href={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedInvoice.invoiceUrl}`}
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Download PDF
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoicesPage;
