"use client";

import React from "react";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import bookImg from "../../public/assets/dummy.png";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();

  // Calculate the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.salePrice * item.quantity,
    0
  );

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id} // Ensure each item has a unique key
              className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md space-y-4 sm:space-y-0"
            >
              {/* Book Cover and Details */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 relative">
                  <Image
                    src={item.image || bookImg}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    Price: <span className="font-bold text-red-700">৳{item.salePrice}</span>
                  </p>
                </div>
              </div>

              {/* Quantity and Remove Controls */}
              <div className="flex flex-row items-center sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, Math.max(1, item.quantity - 1))
                    }
                    className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-white bg-red-600 px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Price */}
      <div className="mt-4 border-t pt-4 bg-white p-4 rounded-lg shadow-md">
        <p className="text-xl font-bold text-center">
          Total: <span className="text-red-700">৳{totalPrice.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default CartPage;
