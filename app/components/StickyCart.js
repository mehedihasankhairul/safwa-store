"use client";

import React, { useState } from "react";
import useCartStore from "../../store/cartStore";

const StickyCart = () => {
  // Access cartItems from the store
  const cartItems = useCartStore((state) => state.cartItems);

  // Calculate total items and total price
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Use the correct field for price (e.g., `salePrice` or `printedPrice`)
  const totalPrice =
    cartItems?.reduce(
      (sum, item) => sum + item.quantity * (item.salePrice || item.printedPrice || 0),
      0
    ) || 0;


  return (
  <>
    <div
      className=" bg-red-700 text-white w-20 h-22 flex flex-col text-center items-center justify-center rounded-md "
      style={{ zIndex: 1000 }}
       
    >
      <div className="text-md font-bold bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center mt-2">
        <span >
          {totalItems}
        </span>
      </div>
      <div className="text-sm">item(s)</div>
      <div className="text-sm text-gray-700 text-center bg-white h-22 w-20 border border-red-600 rounded-b-md font-bold mt-2">৳ {totalPrice.toFixed(2)}</div>
   
    </div>


    
  </>
  );
};

export default StickyCart;
