"use client";

import React, { useState } from "react";
import useCartStore from "@/store/cartStore";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";

const CheckoutPage = () => {
  const { cartItems } = useCartStore();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [bkashTransactionNumber, setBkashTransactionNumber] = useState("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to your cart before placing an order.");
      return;
    }

    const orderDetails = {
      fullName,
      address,
      phoneNumber,
      paymentMethod,
      bkashTransactionNumber: paymentMethod === "bKash" ? bkashTransactionNumber : null,
      items: cartItems,
      totalPrice,
    };

    console.log("Order Submitted:", orderDetails);
    alert("Your order has been placed!");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Cart Items */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.image || dummy}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        ৳ {item.salePrice} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">৳ {item.salePrice * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>৳ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - User Form */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none"
              ></textarea>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none"
              />
            </div>

            {/* Payment Method */}
            <div>
              <p className="block text-sm font-medium">Payment Method</p>
              <div className="flex items-center space-x-4 mt-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-2 focus:ring-red-500"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bKash"
                    checked={paymentMethod === "bKash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-2 focus:ring-red-500"
                  />
                  <span>bKash</span>
                </label>
              </div>
            </div>

            {/* bKash Transaction Number */}
            {paymentMethod === "bKash" && (
              <div>
                <label
                  htmlFor="bkashTransactionNumber"
                  className="block text-sm font-medium"
                >
                  bKash Transaction Number
                </label>
                <input
                  type="text"
                  id="bkashTransactionNumber"
                  value={bkashTransactionNumber}
                  onChange={(e) => setBkashTransactionNumber(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className={`w-full py-2 mt-4 rounded-lg ${cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 text-white"
                }`}
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
