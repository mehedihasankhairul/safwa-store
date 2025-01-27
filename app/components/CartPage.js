"use client";

import React from "react";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { FiTrash2 } from "react-icons/fi";
import dummyImage from "../../public/assets/dummy.png";

import { useRouter } from "next/navigation"; // Import useRouter

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const router = useRouter(); // Initialize the router

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );



  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
            >
              {/* Book Image */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative aspect-square">
                  <Image
                    src={item.image || dummyImage}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                {/* Book Details */}
                <div className="text-left">
                  <h3 className="text-sm text-gray-500 font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">৳ {item.salePrice}</p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center">
                
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                >
                  +
                </button>
                <span className="px-3 text-gray-400">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item._id, Math.max(1, item.quantity - 1))
                  }
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                >
                  -
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total Price */}
      {/* Total Price */}
      <div className="mt-4 border-t pt-4">
        <p className="text-xl font-semibold flex justify-between">
          <span>Total:</span> <span>৳ {totalPrice.toFixed(2)}</span>
        </p>
        <button
          onClick={() => router.push("/checkout")} // Redirect to Checkout Page
          className="w-full bg-red-700 hover:bg-red-800 text-white py-2 mt-4 rounded-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
