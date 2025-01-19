import React from 'react'

const ProductDetails = ({ product }) => (
  <div className="flex gap-8 p-4">
    <img
      src={product.image}
      alt={product.title}
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
        <button className="bg-red-700 text-white px-4 py-2 rounded">Add to Cart</button>
        <button className="bg-green-700 text-white px-4 py-2 rounded">Buy It Now</button>
      </div>
    </div>
  </div>
);


export default ProductDetails