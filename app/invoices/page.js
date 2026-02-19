"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaDownload, FaEye, FaSearch, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const InvoicesPage = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  // Fetch Invoices API
  const fetchInvoices = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);

      const data = await response.json();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  console.log(invoices);
  // ✅ Filter Function
  useEffect(() => {
    let updatedInvoices = invoices;

    if (filter !== "all") {
      updatedInvoices = invoices.filter((invoice) => invoice.paymentStatus === filter);
    }

    if (searchTerm) {
      updatedInvoices = updatedInvoices.filter((invoice) =>
        invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "amount") {
      updatedInvoices = [...updatedInvoices].sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setFilteredInvoices(updatedInvoices);
  }, [filter, searchTerm, sortBy, invoices]);

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Invoices</h1>

      {/* ✅ Filters & Sorting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <select className="p-2 border rounded-md" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <select className="p-2 border rounded-md" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        <div className="flex items-center border rounded-md px-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by Order ID..."
            className="p-2 w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ Display Invoices */}
      {/* ✅ Display Invoices */}
      {loading ? (
        <p className="text-center text-gray-600">Loading invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="text-center text-gray-600">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b text-left">
                <th className="p-3 text-gray-700">Order ID</th>
                <th className="p-3 text-gray-700">Total Amount</th>
                <th className="p-3 text-gray-700">Payment Status</th>
                <th className="p-3 text-gray-700">Order Time</th> {/* ✅ Added Order Time */}
                <th className="p-3 text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.orderId} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{invoice.orderId}</td>
                  <td className="p-3">৳{invoice.totalAmount}</td>
                  <td className="p-3 flex items-center">
                    {invoice.paymentStatus === "Paid" ? (
                      <span className="text-green-600 flex items-center font-semibold">
                        ✅ Paid
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center font-semibold">
                        ❌ Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3">{invoice.createdAt ? new Date(invoice.createdAt).toLocaleString("en-US", { hour12: true }) : "N/A"}</td>

                  <td className="p-3 flex gap-4 justify-center">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      👁 Preview
                    </button>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}${invoice.invoiceUrl}`}
                      target="_blank"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition"
                    >
                      ⬇️ Download
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* ✅ Invoice Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Invoice Preview</h2>
            <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
            <p><strong>Order Date:</strong> {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleDateString("en-US") : "N/A"}</p>
            <p><strong>Order Time:</strong> {selectedInvoice.createdAt ? new Date(selectedInvoice.createdAt).toLocaleTimeString("en-US", { hour12: true }) : "N/A"}</p>

            <p><strong>Total Amount:</strong> ৳{selectedInvoice.totalAmount}</p>
            <p><strong>Payment Status:</strong> {selectedInvoice.paymentStatus}</p>

            {/* ✅ Show Customer Details */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Customer Details:</h3>
              <p><strong>Name:</strong> {selectedInvoice.customer?.name || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedInvoice.customer?.phone || "N/A"}</p>
              <p><strong>Email:</strong> {selectedInvoice.customer?.email || "N/A"}</p>
              <p><strong>Address:</strong> {selectedInvoice.customer?.address || "N/A"}</p>
            </div>

            {/* ✅ Show Book Details */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Books Ordered:</h3>
              <ul className="border rounded-md p-2 mt-2">
                {selectedInvoice.books?.length > 0 ? (
                  selectedInvoice.books.map((book, index) => (
                    <li key={index} className="flex justify-between text-gray-700 py-1">
                      <span>{book.title} (x{book.quantity})</span>
                      <span>৳{book.price}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No books found.</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
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

export default InvoicesPage;
