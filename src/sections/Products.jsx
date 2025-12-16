import products from "../data/products";

export default function Products() {
  return (
    <section style={{ padding: "20px" }}>
      <h2>Products</h2>

      {products.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <strong>{p.name}</strong>
          <p>{p.category}</p>
          <p>{typeof p.price === "number" ? `₹${p.price}` : p.price}</p>

          <a
            href={`https://wa.me/918105750221?text=I%20want%20to%20order%20${encodeURIComponent(p.name)}`}
            target="_blank"
          >
            Order on WhatsApp
          </a>
        </div>
      ))}
    </section>
  );
}
