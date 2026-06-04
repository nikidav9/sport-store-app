'use client'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center py-8">Загрузка...</p>
  if (!products.length) return <p className="text-center py-8">Товары не найдены</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-48 object-cover rounded mb-3" />}
          <h2 className="text-lg font-semibold">{p.name}</h2>
          {p.description && <p className="text-gray-500 text-sm mt-1">{p.description}</p>}
          <p className="text-xl font-bold mt-2">{p.price} ₽</p>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            В корзину
          </button>
        </div>
      ))}
    </div>
  )
}
