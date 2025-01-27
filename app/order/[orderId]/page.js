"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For dynamic routing
import Image from "next/image";
import dummyImage from "../../../public/assets/dummy.png";

const OrderDetailsPage = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`); // Update with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="p-4 text-center">Order not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <p className="text-sm">Order ID: {order.id}</p>
        <p className="text-sm">Date: {new Date(order.date).toLocaleDateString()}</p>
        <p className="text-sm">Status: {order.status}</p>
        <p className="text-sm font-bold mt-2">Total: ৳ {order.totalPrice}</p>
      </div>

      {/* Items */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Items in Order</h2>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative">
                <Image
                  src={item.image || dummyImage}
                  alt={item.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-xs text-gray-500">Price: ৳ {item.salePrice}</p>
              </div>
            </div>
            <p className="text-sm font-bold">৳ {item.salePrice * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Shipping Information */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
        <p className="text-sm">Name: {order.shipping.name}</p>
        <p className="text-sm">Address: {order.shipping.address}</p>
        <p className="text-sm">Phone: {order.shipping.phone}</p>
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <p className="text-sm">{order.payment.method}</p>
        {order.payment.method === "bKash" && (
          <p className="text-sm">Transaction ID: {order.payment.transactionId}</p>
        )}
      </div>

      {/* Tracking Information */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Tracking Information</h2>
        <p className="text-sm">Status: {order.tracking.status}</p>
        <p className="text-sm">Last Updated: {new Date(order.tracking.lastUpdated).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
