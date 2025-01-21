"use client";

import useCartStore from "../../store/cartStore";

const AddToCartButton = ({ item }) => {
  const cartItems = useCartStore((state) => state.cartItems);
  console.log("Cart items in StickyCart:", cartItems);

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button className="bg-green-500 text-white mt-4 px-4 py-2 rounded"
      onClick={() => addToCart(item)}
      style={{
        padding: "10px",
        backgroundColor: "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
