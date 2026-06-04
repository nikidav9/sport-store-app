'use client';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-bold text-blue-600">{product.price} ₽</p>
      <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
        Добавить в корзину
      </button>
    </div>
  );
}
