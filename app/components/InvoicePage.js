"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const InvoicePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [invoiceUrl, setInvoiceUrl] = useState("");

  useEffect(() => {
    if (orderId) {
      setInvoiceUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/invoice/${orderId}`);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
        <p className="text-gray-600 mt-2">Download your invoice below.</p>

        <div className="mt-6">
          {invoiceUrl ? (
            <a href={invoiceUrl} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md" download>
              Download Invoice (PDF)
            </a>
          ) : (
            <p className="text-red-500">Invoice not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
