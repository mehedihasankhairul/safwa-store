import { create } from "zustand";

const useAnalyticsStore = create((set) => ({
  analyticsData: {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  },
  loading: false,
  error: null,

  fetchAllAnalytics: async () => {
    set({ loading: true, error: null });

    try {
      const authToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

      // ✅ Make sure the API calls are correct
      const endpoints = ["daily", "weekly", "monthly", "yearly"];

      const responses = await Promise.all(
        endpoints.map(async (type) => {
          const res = await fetch(`${baseURL}/api/analytics/sales?type=${type}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          const data = await res.json();
          return { type, sales: data.sales || 0 };
        })
      );

      // ✅ Update Zustand state dynamically based on API response
      const updatedAnalyticsData = responses.reduce((acc, { type, sales }) => {
        acc[type] = sales;
        return acc;
      }, {});

      set({ analyticsData: updatedAnalyticsData, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error fetching analytics:", error);
    }
  },
}));

export default useAnalyticsStore;
