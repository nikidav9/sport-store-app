'use client'

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg shadow-md p-6 flex flex-col items-center text-center max-w-sm mx-auto my-8">
      <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4 rounded-lg" />
      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
      <p className="text-xl text-gray-700 mb-4">${product.price}</p>
      <p className="text-gray-600 mb-6">{product.description}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto">
        Add to Cart
      </button>
    </div>
  );
}
