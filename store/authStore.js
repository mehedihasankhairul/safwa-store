import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// const BASE_URL = "https://api-safwa-store.vercel.app/";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
          const { token, user } = response.data;
          set({ user, token, loading: false });

          // Store token and user in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          return { success: true };
        } catch (error) {
          const errMsg = error.response?.data?.message || "Something went wrong. Please try again.";
          set({ error: errMsg, loading: false });
          return { success: false, error: errMsg };
        }
      },
      register: async (name, email, password, role) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${BASE_URL}/auth/signup`, { name, email, password, role });
          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const errMsg = error.response?.data?.message || "Something went wrong. Please try again.";
          set({ error: errMsg, loading: false });
          return { success: false, error: errMsg };
        }
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },
      // Set the initial state from localStorage if available
      hydrate: () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
          set({ user: JSON.parse(storedUser), token: storedToken });
        }
      },
    }),
    {
      name: 'auth-storage', // This key is used in localStorage to persist the state
    }
  )
);

// Call hydrate when the store is first initialized to load user and token from localStorage
useAuthStore.getState().hydrate();

export default useAuthStore;
