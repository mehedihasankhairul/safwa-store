"use client";
import { create } from "zustand";

const useAnalyticsStore = create((set, get) => ({
  analytics: {
    daily: { totalSales: 0, totalOrders: 0, growth: 0 },
    weekly: { totalSales: 0, totalOrders: 0, growth: 0 },
    monthly: { totalSales: 0, totalOrders: 0, growth: 0 },
    yearly: { totalSales: 0, totalOrders: 0, growth: 0 },
    topBooks: [],
    topCategories: [],
  },
  loading: true,
  error: null,

  fetchAnalytics: async () => {
    try {
      // ✅ Avoid fetching again if data is already present
      if (get().analytics.daily.totalSales !== 0) {
        console.log("Analytics data already loaded. Skipping fetch.");
        return;
      }

      set({ loading: true, error: null });

      console.log("Fetching analytics data...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/sales`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      // ✅ Ensure data structure is correct before setting state
      set({
        analytics: {
          daily: data.daily || { totalSales: 0, totalOrders: 0, growth: 0 },
          weekly: data.weekly || { totalSales: 0, totalOrders: 0, growth: 0 },
          monthly: data.monthly || { totalSales: 0, totalOrders: 0, growth: 0 },
          yearly: data.yearly || { totalSales: 0, totalOrders: 0, growth: 0 },
          topBooks: Array.isArray(data.topBooks) ? data.topBooks : [],
          topCategories: Array.isArray(data.topCategories) ? data.topCategories : [],
        },
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      set({ error, loading: false });
    }
  },
}));

export default useAnalyticsStore;
