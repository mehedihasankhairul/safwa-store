import { fetchProducts } from '../../utils/api';

export default async function ProductsPage() {
  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Our Products</h1>
      <ul className="list-disc pl-5">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} className="text-lg my-2">
              <a
                href={`/products/${product._id}`}
                className="text-blue-600 hover:underline"
              >
                {product.title} by {product.author} - ${product.price}
              </a>
            </li>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </ul>
    </div>
  );
}
