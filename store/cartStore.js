import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i._id === item._id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i._id === item._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item._id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: "cart-storage", // Name of the local storage key
    }
  )
);

export default useCartStore;
