import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

// const BASE_URL = "https://api-safwa-store.vercel.app/";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isHydrated: false,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
          const { token, user } = response.data;
          set({ user, token, loading: false });

          // Store token and user in localStorage and cookies
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            
            // Set cookies for middleware access
            document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
            document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
          }

          return { success: true, user };
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          
          // Remove cookies
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Return a no-op storage for SSR, real localStorage for client
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

export default useAuthStore;
