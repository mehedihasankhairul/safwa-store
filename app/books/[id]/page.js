export default function ProductDetail({ params }) {
  const { id } = params;

  return (
    <div>
      <h1>Product Details</h1>
      <p>Details of product with ID: {id}</p>
    </div>
  );
}
