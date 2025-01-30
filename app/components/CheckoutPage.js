"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import Image from "next/image";
import dummy from "../../public/assets/dummy.png";
import bdLocation from "../data/bd-geo-location.js";




const CheckoutPage = () => {
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTM1ZTUxYzA0MTZmYjA1ZjA3NmYyMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM3NzExMjU1LCJleHAiOjE3MzgzMTYwNTV9.CFMFHxQL0jUxUj9eUsnA0yRRNcl516BT7DSr_V9Zg6I"
  const { cartItems, clearCart } = useCartStore();

  

  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    division: "",
    district: "",
    upazila: "",
    paymentMethod: "cod",
    transactionId: "",
    notes: ""
  });

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

 

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );
  // Handle division selection
  const handleDivisionChange = (e) => {
    const divisionId = e.target.value;
    setSelectedDivision(divisionId);
    setFormData({ ...formData, division: divisionId }); // ✅ Ensure it's updated
    setSelectedDistrict(""); // Reset district selection
    setSelectedUpazila(""); // Reset upazila selection

    // Find the selected division from JSON
    const division = bdLocation.find((div) => div.id === divisionId);

    // Update districts list
    setDistricts(division ? division.districts : []);
    setUpazilas([]); // Reset upazilas when division changes
   
  };

  // Handle district selection
  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setFormData({ ...formData, district: districtId }); // ✅ Ensure it's updated


    // Find selected district in the division
    const selectedDivisionData = bdLocation.find((div) =>
      div.districts.some((dist) => dist.id === districtId)
    );

    if (selectedDivisionData) {
      const selectedDistrictData = selectedDivisionData.districts.find(
        (dist) => dist.id === districtId
      );

      if (selectedDistrictData) {
        setUpazilas(selectedDistrictData.upazilas || []); // Update upazilas
      }
    } else {
      setUpazilas([]); // Reset if no upazilas found
    }

    setSelectedUpazila(""); // Reset upazila selection when district changes
  };


  // Handle upazila selection
  const handleUpazilaChange = (e) => {
    const upazilaId = e.target.value;
    setFormData({ ...formData, upazila: upazilaId }); // ✅ Ensure it's updated

    // Check if upazila exists in current district
    const isValidUpazila = upazilas.some((upz) => upz.id === upazilaId);

    if (isValidUpazila) {
      setSelectedUpazila(upazilaId);
    } else {
      setSelectedUpazila(""); // Reset if not valid
    }
  };

  const getValidPaymentMethod = (method) => {
    if (method === "Cash On Delivery") return "cod"; // Use the correct API format
    if (method === "bkash") return "bkash";
    if (method === "nagad") return "nagad";
    return ""; // Return empty if invalid
  };





  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// console.log(cartItems)
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure cart is not empty
    const books = cartItems?.map((item) => ({
      bookId: item._id,
      quantity: item.quantity
    })) || [];


    if (books.length === 0) {
      alert("Your cart is empty. Add books before placing an order.");
      return;
    }

    // Ensure payment method is valid
    const validPaymentMethod = getValidPaymentMethod(formData.paymentMethod);
    if (!validPaymentMethod) {
      alert("Invalid payment method selected.");
      return;
    }

    const orderData = {
      books: books,
      fullAddress: formData.address,
      division: selectedDivision,
      district: selectedDistrict,
      upazila: selectedUpazila,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
      },
      payment: {
        method: validPaymentMethod,
        transactionId: formData.transactionId || "",
        status: formData.paymentMethod === "cash-on-delivery" ? "Pending" : "Paid",
      },
      notes: formData.notes,
    };

    console.log("Sending Order Data:", JSON.stringify(orderData, null, 2)); // Debugging output

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        
        Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(orderData),
      });

      const textResponse = await response.text();
      console.log("Raw API Response:", textResponse);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${textResponse}`);
      }

      const responseData = JSON.parse(textResponse);
      console.log("Parsed API Response:", responseData);

      clearCart();
      router.push("/order-success");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />

            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              pattern="01[3-9][0-9]{8}"
              title="Please enter a valid 11-digit Bangladeshi phone number."
              
              onKeyDown={(e) => {
                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

                if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email (Optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />

            

            { /*Divison, District & Upazila */}

            {/* Division */}
            <div className="flex space-x-4">
              <select
                name="division" 
                required 
                value={selectedDivision} 
                onChange={handleDivisionChange}
                className="w-1/2 p-2 border rounded-md input"
              
              >
                <option value="">Select Division</option>
                {bdLocation.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>

              {/* District */}
              <select
                className="w-1/2 p-2 border rounded-md input"
                required
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedDivision}

              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>

              {/* Upazila */} 
              <select
                className="w-1/2 p-2 border rounded-md"
                required
                value={selectedUpazila}
                onChange={handleUpazilaChange}
                disabled={!selectedDistrict}

              >
              
                <option value="">Select Upazila</option>
                {upazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
                 
                  
                ))}
              </select>
            </div>

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            ></textarea>

           

            {/* Payment Method */}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="cash-on-delivery" checked={formData.paymentMethod === "cash-on-delivery"} onChange={handleChange} />
                <span className="ml-2">Cash on Delivery</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="bkash" checked={formData.paymentMethod === "bkash"} onChange={handleChange} />
                <span className="ml-2">Bkash</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="paymentMethod" value="nagad" checked={formData.paymentMethod === "nagad"} onChange={handleChange} />
                <span className="ml-2">Nagad</span>
              </label>
            </div>

            {/* Transaction ID (Bkash/Nagad Only) */}
            {["bkash", "nagad"].includes(formData.paymentMethod) && (
              <input
                type="text" name="transactionId" placeholder="Transaction ID" required value={formData.transactionId} onChange={handleChange}
                className="w-full p-2 border rounded-md input"
              />
            )}
            
          
            <textarea
              name="notes"
              placeholder="Additional Notes (Optional)"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            ></textarea>

            <button type="submit" className="w-full bg-red-700 text-white py-2 rounded-md">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
