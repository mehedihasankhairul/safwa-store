"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaHome, FaFileInvoice } from "react-icons/fa";

const OrderSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <OrderSuccess />
    </Suspense>
  );
};

const OrderSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const totalAmount = searchParams.get("totalAmount") || 0;
    const paymentStatus = searchParams.get("paymentStatus") || "Pending";

    if (orderId) {
      setOrderDetails({ orderId, totalAmount, paymentStatus });
    }
  }, [searchParams]);

  // Separate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate redirect effect to avoid React Router update-during-render warning
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  const getStatusColor = useCallback((status) => {
    const s = status?.toLowerCase();
    if (s === "paid" || s === "completed") return "text-green-600 bg-green-100";
    if (s === "pending") return "text-amber-600 bg-amber-100";
    return "text-gray-600 bg-gray-100";
  }, []);

  const getStatusLabel = useCallback((status) => {
    const s = status?.toLowerCase();
    if (s === "paid") return "Paid";
    if (s === "pending") return "Pending";
    if (s === "completed") return "Completed";
    return status || "Unknown";
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Green Header Bar */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-bounce">
            <FaCheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Order Placed Successfully!
          </h1>
          <p className="text-green-100 mt-2 text-sm">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {orderDetails ? (
            <div className="space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  📦 Order ID
                </span>
                <span className="text-sm font-mono font-bold text-gray-800">
                  #{orderDetails.orderId.slice(-8).toUpperCase()}
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  💰 Total Amount
                </span>
                <span className="text-lg font-bold text-gray-800">
                  ৳ {Number(orderDetails.totalAmount).toLocaleString()}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  🔄 Payment Status
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(
                    orderDetails.paymentStatus
                  )}`}
                >
                  {getStatusLabel(orderDetails.paymentStatus)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaHome />
              Continue Shopping
            </Link>

            {orderDetails && (
              <Link
                href={`/invoice?orderId=${orderDetails.orderId}`}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200"
              >
                <FaFileInvoice />
                Download Invoice (PDF)
              </Link>
            )}
          </div>

          {/* Countdown */}
          <p className="text-center text-sm text-gray-400 mt-5">
            Redirecting to home in{" "}
            <span className="font-bold text-gray-600">{countdown}s</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
