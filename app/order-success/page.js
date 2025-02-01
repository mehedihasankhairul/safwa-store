"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    totalAmount: 0,
    paymentStatus: "",
  });

  useEffect(() => {
    // Fetch order details from URL query params
    const orderId = searchParams.get("orderId");
    const totalAmount = searchParams.get("totalAmount");
    const paymentStatus = searchParams.get("paymentStatus") || "Pending";

    if (orderId) {
      setOrderDetails({ orderId, totalAmount, paymentStatus });
    }

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your order. Your order has been successfully placed and will be processed soon.
        </p>

        {/* Order Details Section */}
        <div className="bg-gray-100 p-4 rounded-lg mt-4 text-left">
          <p className="text-gray-800 font-semibold">📦 Order ID: <span className="font-normal">{orderDetails.orderId}</span></p>
          <p className="text-gray-800 font-semibold">💰 Total Price: <span className="font-normal">৳ {orderDetails.totalAmount}</span></p>
          <p className="text-gray-800 font-semibold">🔄 Payment Status:
            <span className={`font-normal ml-2 ${orderDetails.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
              {orderDetails.paymentStatus}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-x-4">
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Back to Home
            </button>
          </Link>
          <Link href="/invoice?orderId=${orderId}">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Download Invoice (PDF)
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to home in <span className="font-semibold">10 seconds...</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
