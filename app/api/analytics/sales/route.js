// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db"; // Ensure MongoDB connection
// import Order from "@/models/orderModel"; // Import Order model

// // Utility function for date filtering
// const getDateFilter = (startDate, endDate) => {
//   const filter = {};
//   const today = new Date();
//   const defaultStartDate = new Date();
//   defaultStartDate.setDate(today.getDate() - 7); // Default last 7 days

//   filter.$gte = startDate ? new Date(startDate) : defaultStartDate;
//   filter.$lte = endDate ? new Date(endDate) : today;

//   filter.$lte.setHours(23, 59, 59, 999); // Ensure full-day inclusion
//   return { createdAt: filter };
// };

// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const startDate = searchParams.get("startDate");
//     const endDate = searchParams.get("endDate");
//     const dateFilter = getDateFilter(startDate, endDate);

//     // Fetch sales data for daily, weekly, monthly, and yearly
//     const [dailySales, weeklySales, monthlySales, yearlySales] = await Promise.all([
//       getSalesByPeriod(dateFilter, "day"),
//       getSalesByPeriod(dateFilter, "week"),
//       getSalesByPeriod(dateFilter, "month"),
//       getSalesByPeriod(dateFilter, "year"),
//     ]);

//     return NextResponse.json({
//       daily: dailySales,
//       weekly: weeklySales,
//       monthly: monthlySales,
//       yearly: yearlySales,
//     });
//   } catch (error) {
//     console.error("Error fetching analytics:", error);
//     return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
//   }
// }

// async function getSalesByPeriod(dateFilter, period) {
//   const groupBy =
//     period === "day"
//       ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } }
//       : period === "week"
//         ? { year: { $year: "$createdAt" }, week: { $isoWeek: "$createdAt" } }
//         : period === "month"
//           ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
//           : { year: { $year: "$createdAt" } };

//   return Order.aggregate([
//     { $match: { status: "Completed", ...dateFilter } },
//     {
//       $group: {
//         _id: groupBy,
//         totalSales: { $sum: "$totalAmount" },
//         totalOrders: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
//   ]);
// }
