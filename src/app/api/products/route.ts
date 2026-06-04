import { NextRequest, NextResponse } from 'next/server'

// Placeholder for Redis client initialization
// const redisClient = createRedisClient()

// Placeholder for DB client initialization
// const dbClient = createDbClient()

export const maxDuration = 60

// GET all products (with caching)
export async function GET(req: NextRequest) {
  try {
    // const cachedProducts = await redisClient.get('products')
    // if (cachedProducts) {
    //   return NextResponse.json(JSON.parse(cachedProducts))
    // }

    // const products = await dbClient.getProducts()
    const products = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 },
    ] // Dummy data

    // await redisClient.set('products', JSON.stringify(products), { ex: 3600 }) // Cache for 1 hour

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create a new product
export async function POST(req: NextRequest) {
  try {
    const { name, price } = await req.json()

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    // const newProduct = await dbClient.createProduct({ name, price })
    const newProduct = { id: Date.now(), name, price } // Dummy data

    // Invalidate cache for products
    // await redisClient.del('products')

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
