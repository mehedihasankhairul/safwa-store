const Reviews = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold">Reviews</h2>
    <form className="mt-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="rating">Your Rating</label>
        <select
          id="rating"
          className="border rounded p-2"
          defaultValue="5"
        >
          <option value="5">★★★★★</option>
          <option value="4">★★★★</option>
          <option value="3">★★★</option>
          <option value="2">★★</option>
          <option value="1">★</option>
        </select>
        <textarea
          placeholder="Write your review..."
          className="border rounded p-2 h-20"
        />
        <input
          type="text"
          placeholder="Your Name"
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border rounded p-2"
        />
        <button className="bg-red-700 text-white px-4 py-2 rounded mt-2">
          Submit
        </button>
      </div>
    </form>
  </div>
);