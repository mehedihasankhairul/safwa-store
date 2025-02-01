import Image from 'next/image';
import React from 'react'
import mainLogo from '../../public/assets/logo.png';
import Link from 'next/link';


const Header = () => (

  <header className="flex items-center  justify-between bg-red-700 text-white p-4">
    <div className="flex"><Image src={mainLogo} height={20} width={40} alt="Logo" className="h-10" />
      <h1 className="text-2xl font-bold">Safwa Store</h1></div>
    <nav className="flex gap-4">
      <Link href="/">Home </Link>
      <a href="#">Categories</a>
      <a href="#">Best Sellers</a>
      <a href="#">Contact</a>
      <Link href="/invoices" className="text-blue-500 hover:underline">
        My Invoices
      </Link>

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