"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import dummyImage from "../../../public/assets/dummy.png";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const printRef = useRef();

  const order = {
    id: orderId,
    date: "2023-12-01",
    status: "Processing",
    totalPrice: 305,
    items: [
      {
        id: 1,
        title: "The Great Adventure",
        quantity: 2,
        salePrice: 120,
        image: dummyImage,
      },
      {
        id: 2,
        title: "Book 2",
        quantity: 1,
        salePrice: 185,
        image: dummyImage,
      },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Street Name, City",
      phone: "123456789",
    },
    payment: {
      method: "Cash on Delivery",
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, 190, 0);
    doc.save(`order-${order.id}.pdf`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div ref={printRef} className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <p>Order ID: {order.id}</p>
        <p>Date: {order.date}</p>
        <p>Status: {order.status}</p>
        <p>Total: ৳ {order.totalPrice}</p>

        <h2 className="text-lg font-bold mt-4">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 my-2">
            <Image
              src={item.image || dummyImage}
              alt={item.title}
              width={50}
              height={50}
              className="rounded-md"
            />
            <div>
              <p>{item.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ৳ {item.salePrice}</p>
            </div>
          </div>
        ))}

        <h2 className="text-lg font-bold mt-4">Shipping Information</h2>
        <p>Name: {order.shipping.name}</p>
        <p>Address: {order.shipping.address}</p>
        <p>Phone: {order.shipping.phone}</p>

        <h2 className="text-lg font-bold mt-4">Payment Method</h2>
        <p>{order.payment.method}</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
