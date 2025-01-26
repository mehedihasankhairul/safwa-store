import { create } from "zustand";

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => {
      // Check if the item already exists in the cart
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        // If it exists, update the quantity
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      // If it doesn't exist, add it as a new item
      return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  totalItems: (state) =>
    state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: (state) =>
    state.cartItems.reduce((sum, item) => sum + item.quantity * item.salePrice, 0),
}));

export default useCartStore;
