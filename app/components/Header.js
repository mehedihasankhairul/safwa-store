import React from 'react'

const Header = () => (
  <header className="flex items-center justify-between bg-red-700 text-white p-4">
    <img src="/logo.png" alt="Logo" className="h-10" />
    <nav className="flex gap-4">
      <a href="#">Home</a>
      <a href="#">Categories</a>
      <a href="#">Best Sellers</a>
      <a href="#">Contact</a>
    </nav>
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search for books..."
        className="px-2 py-1 rounded"
      />
      <button className="bg-white text-red-700 px-4 py-1 rounded">
        Login/Register
      </button>
    </div>
  </header>
);


export default Header