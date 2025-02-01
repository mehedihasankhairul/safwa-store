"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";


const CheckoutPage = () => {
  const authToken =  process.env.NEXT_PUBLIC_AUTH_TOKEN;
  const { cartItems, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    fullAddress: "", // Updated to single address field
    paymentMethod: "cod",
    transactionId: "",
    notes: "",
  });

  // ✅ **Define `getValidPaymentMethod` before using it**
  const getValidPaymentMethod = (method) => {
    if (method === "cod") return "cod"; // ✅ Keep "cod" as it is
    if (method === "bkash") return "bkash";
    if (method === "nagad") return "nagad";
    return "";
  };


  // ✅ **Define `handleChange` to update form values**
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ **Define `handleSubmit`**
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure cart is not empty
    const books = cartItems.map((item) => ({
      bookId: item._id,
      quantity: item.quantity,
    }));

    if (books.length === 0) {
      alert("Your cart is empty. Add books before placing an order.");
      return;
    }

    // Ensure valid payment method
    const validPaymentMethod = getValidPaymentMethod(formData.paymentMethod);
    if (!validPaymentMethod) {
      alert("Invalid payment method selected.");
      return;
    }

    // ✅ Prepare `orderData` to send
    const orderData = {
      books,
      fullAddress: formData.fullAddress,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
      },
      payment: {
        method: getValidPaymentMethod(formData.paymentMethod), // ✅ Correct value
        transactionId: formData.transactionId || "",
        status: formData.paymentMethod === "cod" ? "Pending" : "Paid",
      },
      notes: formData.notes,
    };

    console.log("Sending Order Data:", JSON.stringify(orderData, null, 2)); // Debugging output

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Parsed API Response:", responseData);

      // ✅ Redirect to order success page with order details
      router.push(`/order-success?orderId=${responseData.order._id}&totalAmount=${responseData.order.totalAmount}&paymentStatus=${responseData.order.payment.status}`);

      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert(`Order failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Order Summary */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-4">
                    <Image src={item.image || dummy} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-600">৳ {item.salePrice} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">৳ {item.salePrice * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>৳ {cartItems.reduce((total, item) => total + item.salePrice * item.quantity, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - User Form */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <input type="number" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" />

            {/* Full Address Field */}
            <textarea name="fullAddress" placeholder="Full Address" value={formData.fullAddress} onChange={handleChange} required className="w-full p-2 border rounded-md"></textarea>

            {/* Payment Method */}
            {/* Payment Method */}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={formData.paymentMethod === "bkash"}
                  onChange={handleChange}
                />
                <span className="ml-2">Bkash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="nagad"
                  checked={formData.paymentMethod === "nagad"}
                  onChange={handleChange}
                />
                <span className="ml-2">Nagad</span>
              </label>
            </div>


            {/* Transaction ID (Bkash/Nagad Only) */}
            {["bkash", "nagad"].includes(formData.paymentMethod) && (
              <input type="text" name="transactionId" placeholder="Transaction ID" required value={formData.transactionId} onChange={handleChange} className="w-full p-2 border rounded-md" />
            )}

            <textarea name="notes" placeholder="Additional Notes (Optional)" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded-md"></textarea>

            <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-md">Place Order</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
