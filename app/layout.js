
import "../public/styles/globals.css"
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import StickyCart from "./components/StickyCart";


export const metadata = {
  title: 'Safwa Store BD | Online Book Store to find all kinds of Islamic Books',
  description: 'Safwa Store BD is your one-stop online book store for a wide range of Islamic books. Discover a vast collection of religious texts, educational materials, and spiritual guides to enrich your knowledge and faith. Shop conveniently and securely from the comfort of your home.',

};

// src/app/layout.js

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
        <div style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: "1000"}}>
          {/* StickyCart Component */}
          <StickyCart />
        </div>
      </body>
    </html>
  );
}