"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEye, FaTrash, FaSync } from "react-icons/fa";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error(`Error: ${await response.text()}`);

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order._id}</td>
                <td className="p-3">৳{order.totalAmount}</td>
                <td className={`p-3 font-semibold ${order.status === "Completed" ? " text-green-700" : " text-yellow-700 "} rounded-md px-2`}>{order.status}</td>
                <td className="p-3 text-center flex gap-2 justify-center">
                  <button onClick={() => updateOrderStatus(order._id, "Completed")} className="bg-green-600 text-white px-3 py-1 rounded-md flex items-center">
                    <FaCheckCircle className="mr-2" /> Approve
                  </button>
                  <button onClick={() => updateOrderStatus(order._id, "Cancelled")} className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center">
                    <FaTimesCircle className="mr-2" /> Cancel
                  </button>
                  <button onClick={() => deleteOrder(order._id)} className="bg-gray-600 text-white px-3 py-1 rounded-md flex items-center">
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
