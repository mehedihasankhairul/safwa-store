import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      console.log("Adding item to cart:", item);
      console.log("Current cart:", state.cartItems);
      return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),



  // Remove an item from the cart
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  // Get total items in the cart
  totalItems: (state) =>
    state.cartItems.reduce((sum, item) => sum + item.quantity, 0),

  // Get total price of the cart
  totalPrice: (state) =>
    state.cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
}));

export default useCartStore;
