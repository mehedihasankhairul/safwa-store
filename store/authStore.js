import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

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
          const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
          const { token, user } = response.data;
          set({ user, token, loading: false });
          
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
          const response = await axios.post(`${BASE_URL}/api/auth/signup`, { name, email, password, role });
          set({ loading: false });
          return { success: true, message: response.data.message };
        } catch (error) {
          const errMsg = error.response?.data?.message || "Something went wrong. Please try again.";
          set({ error: errMsg, loading: false });
          return { success: false, error: errMsg };
        }
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // This key is used in localStorage to persist the state
    }
  )
);

export default useAuthStore;
