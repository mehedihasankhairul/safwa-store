// src/app/cart/page.js
'use client';

import withAuth from "../components/withAuth";

const Cart = () => {
  return (
    <div>
      <h1>My Cart</h1>
      <p>Your cart items will appear here.</p>
    </div>
  );
};

export default withAuth(Cart, "user");
