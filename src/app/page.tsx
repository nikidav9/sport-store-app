import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

const products = [
  {
    id: '1',
    name: 'Футбольный мяч Nike',
    price: 3500,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Nike+Football',
  },
  {
    id: '2',
    name: 'Баскетбольный мяч Spalding',
    price: 4200,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Spalding+Basketball',
  },
  {
    id: '3',
    name: 'Теннисная ракетка Babolat',
    price: 12000,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Babolat+Tennis',
  },
  {
    id: '4',
    name: 'Кроссовки Adidas Running',
    price: 9000,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Adidas+Running',
  },
  {
    id: '5',
    name: 'Гантели разборные 15кг',
    price: 6000,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Dumbbells',
  },
  {
    id: '6',
    name: 'Коврик для йоги',
    price: 1500,
    imageUrl: 'https://via.placeholder.com/300/F5F5F5/000000?text=Yoga+Mat',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Наши товары</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
