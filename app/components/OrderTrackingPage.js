"use client";

import React, { useState } from "react";
import { trackOrder } from "@/utils/api"; // Import the API function

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    setError(""); // Clear previous errors
    setOrderDetails(null); // Reset order details
    try {
      const token = localStorage.getItem("token"); // Fetch token from local storage
      const order = await trackOrder(orderId, token);
      if (order) {
        setOrderDetails(order);
      } else {
        setError("Order not found. Please check the order ID.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while tracking the order.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your order ID"
          className="flex-grow p-2 border rounded-md"
        />
        <button
          onClick={handleTrackOrder}
          className="bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded-md"
        >
          Track Order
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {orderDetails && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <p>
            <strong>Order ID:</strong> {orderDetails.id}
          </p>
          <p>
            <strong>Status:</strong> {orderDetails.status}
          </p>
          <p>
            <strong>Total Price:</strong> ৳ {orderDetails.totalPrice}
          </p>
          <p>
            <strong>Items:</strong>
          </p>
          <ul className="list-disc ml-6">
            {orderDetails.items.map((item) => (
              <li key={item.id}>
                {item.title} (x{item.quantity}) - ৳ {item.salePrice}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
