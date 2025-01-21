import Image from 'next/image';
import React from 'react'
import AddToCartButton from './AddToCartButton';
import dummyBookCover from "../../public/assets/dummy.png";

const ProductDetails = ({ product }) => (
  console.log("from product details page :", product),
  < div className="flex gap-8 p-4" >
    <Image

      src={product.cover || dummyBookCover}
      alt={product.title || "Book Cover"}
      className="w-1/3 rounded border"
    />
    <div className="w-2/3">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-600">Author: {product.author}</p>
      <p className="text-gray-600">Category: {product.category}</p>
      <p className="text-gray-600">Publisher: {product.publisher}</p>
      <div className="mt-4">
        <span className="text-red-700 line-through">৳{product.originalPrice}</span>
        <span className="ml-2 text-green-700 font-bold">৳{product.discountedPrice}</span>
      </div>
      <p className="mt-4">{product.description}</p>
      <div className="mt-4 flex items-center gap-4">
        <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
          <h3>{product.name}</h3>
          <p>Price: ৳ {product.price}</p>
          {/* Pass product data to the AddToCartButton */}
          <AddToCartButton item={product} />
        </div>
        <button className="bg-green-700 text-white px-4 py-2 rounded">Buy It Now</button>
      </div>
    </div>
  </div >
);


export default ProductDetails