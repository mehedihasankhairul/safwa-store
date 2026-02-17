"use client";

import { useRouter } from "next/navigation";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";

const AddToCartButton = ({ item, quantity = 1 }) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login to proceed with purchase");
      return;
    }
    
    // Add item to cart first
    addToCart(item);
    
    // Then redirect to checkout
    router.push('/checkout');
  };

  return (
    <div className="flex gap-2 ml-4">
      <button 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        onClick={handleAddToCart}
      >
        Add to cart
      </button>
      <button 
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        onClick={handleBuyNow}
      >
        Buy Now
      </button>
    </div>
  );
};

export default AddToCartButton;
