import ProductList from '../components/ProductList';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

async function getProducts(): Promise<Product[]> {
  // Relative path works for server components in Next.js App Router
  const res = await fetch('/api/products', {
    cache: 'no-store', // Always re-fetch data on each request
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center py-8 text-gray-800">Наши товары</h1>
      <ProductList products={products} />
    </main>
  );
}
