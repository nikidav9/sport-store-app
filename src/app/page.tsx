import ProductList from '@/components/ProductList';

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      <ProductList />
    </main>
  );
}
