export default function Home({ setPage }) {
  return (
    <section className="text-center py-20 bg-gradient-to-br from-pink-100 to-purple-100">
      <h2 className="text-4xl font-bold mb-4">
        Eco-friendly • Hand-made • Made-to-order
      </h2>
      <p className="mb-8 text-gray-700">
        Upcycled textile products stitched with love
      </p>
      <button
        onClick={() => setPage('shop')}
        className="bg-purple-600 text-white px-6 py-3 rounded"
      >
        Shop Now
      </button>
    </section>
  );
}
