"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { createOrder } from "@/utils/api";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";


const CheckoutPage = () => {
  const { token, user } = useAuthStore();
  const { cartItems, clearCart } = useCartStore();
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    if (!user || !token) {
      alert("Please login to access checkout");
      router.push('/');
      return;
    }
  }, [user, token, router]);

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

    // ✅ **Comprehensive Validation**

    // 1. Validate cart is not empty
    const books = cartItems.map((item) => ({
      bookId: item._id,
      quantity: item.quantity,
    }));

    if (books.length === 0) {
      alert("Your cart is empty. Add books before placing an order.");
      return;
    }

    // 2. Validate required fields
    if (!formData.fullAddress.trim()) {
      alert("Full address is required.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    // 3. Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }

    // 4. Validate email format if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    // 5. Validate payment method
    const validPaymentMethod = getValidPaymentMethod(formData.paymentMethod);
    if (!validPaymentMethod) {
      alert("Invalid payment method selected.");
      return;
    }

    // 6. Validate transaction ID for bkash/nagad
    if (["bkash", "nagad"].includes(formData.paymentMethod) && !formData.transactionId.trim()) {
      alert(`Transaction ID is required for ${formData.paymentMethod.toUpperCase()} payment.`);
      return;
    }

    // ✅ Prepare `orderData` to send - Match API structure exactly
    // Create contactInfo object and conditionally add email only if it's not empty
    const contactInfo = {
      phone: formData.phone,
    };

    // Only add email if it's provided and not empty
    if (formData.email && formData.email.trim() !== "") {
      contactInfo.email = formData.email.trim();
    }

    // Create payment object - only include transactionId if it's provided
    const payment = {
      method: getValidPaymentMethod(formData.paymentMethod),
      status: "pending",
    };

    // Only add transactionId if it's provided for bkash/nagad
    if (["bkash", "nagad"].includes(formData.paymentMethod) && formData.transactionId.trim()) {
      payment.transactionId = formData.transactionId.trim();
    }

    const orderData = {
      books,
      fullAddress: formData.fullAddress, // API expects this field name
      contactInfo,
      payment,
      notes: formData.notes || "", // Ensure notes is always a string
    };

    console.log("Sending Order Data:", JSON.stringify(orderData, null, 2)); // Debugging output

    try {
      const responseData = await createOrder(orderData, token);

      if (!responseData || !responseData.order) {
        throw new Error("Order submission failed: No order returned");
      }

      console.log("Parsed API Response:", responseData);

      // ✅ Redirect to order success page with order details
      router.push(`/order-success?orderId=${responseData.order._id}&totalAmount=${responseData.order.totalAmount}&paymentStatus=${responseData.order.payment.status}`);

      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);

      // Better error handling based on error type
      let errorMessage = "Order submission failed. Please try again.";

      if (error.message.includes("abortTransaction")) {
        errorMessage = "Order processing error occurred. Your order might have been created. Please check your order history or contact support.";
      } else if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        errorMessage = "Your session has expired. Please login again.";
        // Redirect to login or home
        router.push('/');
        return;
      } else if (error.message.includes("400")) {
        // Parse validation errors if available
        try {
          const errorData = JSON.parse(error.message.split(': ')[1]);
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = `Validation Error: ${errorData.errors[0].msg}`;
          }
        } catch (parseError) {
          errorMessage = "Invalid data provided. Please check your input.";
        }
      } else if (error.message.includes("500")) {
        errorMessage = "Server error occurred. Please try again later or contact support.";
      }

      alert(errorMessage);
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
