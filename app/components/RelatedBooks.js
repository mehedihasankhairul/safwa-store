const RelatedBooks = ({ relatedBooks }) => (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Related Books</h2>
    <div className="grid grid-cols-2 gap-4">
      {relatedBooks.map((book) => (
        <div key={book.id} className="border rounded p-2">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-40 object-cover"
          />
          <h3 className="mt-2 text-lg">{book.title}</h3>
          <p className="text-red-700">৳{book.price}</p>
        </div>
      ))}
    </div>
  </div>
);
