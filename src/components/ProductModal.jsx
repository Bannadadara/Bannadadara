import { X } from 'lucide-react';

export default function ProductModal({ product, setSelectedProduct }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        className="bg-white p-6 rounded max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-xl">{product.name}</h2>
          <X
            className="cursor-pointer"
            onClick={() => setSelectedProduct(null)}
          />
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
        <p className="mt-4">{product.description}</p>
        <p className="font-bold mt-2">₹{product.price}</p>
      </div>
    </div>
  );
}
