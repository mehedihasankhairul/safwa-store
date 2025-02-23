"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <OrderSuccess />
    </Suspense>
  );
};

const OrderSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const totalAmount = searchParams.get("totalAmount") || 0;
    const paymentStatus = searchParams.get("paymentStatus") || "Pending";

    if (orderId) {
      setOrderDetails({ orderId, totalAmount, paymentStatus });
    }

    // Countdown Timer for Redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <Card sx={{ maxWidth: 450, textAlign: "center", boxShadow: 3, p: 4 }}>
        <CardContent>
          <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🎉 Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Thank you for your order. It has been successfully placed and will be processed soon.
          </Typography>

          {/* ✅ Order Details */}
          {orderDetails ? (
            <div className="bg-gray-100 p-4 rounded-lg mt-4 text-left">
              <Typography variant="body2" fontWeight="bold">📦 Order ID:</Typography>
              <Typography variant="body2" color="textSecondary">{orderDetails.orderId}</Typography>

              <Typography variant="body2" fontWeight="bold" mt={1}>💰 Total Price:</Typography>
              <Typography variant="body2" color="textSecondary">৳ {orderDetails.totalAmount}</Typography>

              <Typography variant="body2" fontWeight="bold" mt={1}>🔄 Payment Status:</Typography>
              <Typography
                variant="body2"
                color={orderDetails.paymentStatus === "Paid" ? "success.main" : "warning.main"}
              >
                {orderDetails.paymentStatus}
              </Typography>
            </div>
          ) : (
            <CircularProgress sx={{ mt: 2 }} />
          )}

          {/* ✅ Buttons */}
          <div className="mt-6 space-x-4">
            <Button variant="contained" color="primary" component={Link} href="/">
              Back to Home
            </Button>
            <Button
              variant="contained"
              color="success"
              component={Link}
              href={`/invoice?orderId=${orderDetails?.orderId}`}
              disabled={!orderDetails}
            >
              Download Invoice (PDF)
            </Button>
          </div>

          {/* ✅ Countdown */}
          <Typography variant="body2" color="textSecondary" mt={3}>
            Redirecting to home in <strong>{countdown} seconds...</strong>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
