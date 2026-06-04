import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Redis } from 'ioredis'

// Инициализация клиента PostgreSQL (Supabase)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

// Инициализация клиента Redis
const redis = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
})

const REDIS_PRODUCTS_KEY = 'products'

export const maxDuration = 60

// GET /api/products - Получить список всех товаров (с кэшированием в Redis)
export async function GET(req: NextRequest) {
  try {
    // Проверяем, есть ли товары в кэше Redis
    const cachedProducts = await redis.get(REDIS_PRODUCTS_KEY)
    if (cachedProducts) {
      console.log('Returning products from Redis cache')
      return NextResponse.json(JSON.parse(cachedProducts))
    }

    console.log('Fetching products from Supabase')
    // Если в кэше нет, получаем данные из Supabase
    const { data, error } = await supabase.from('products').select('*')

    if (error) {
      console.error('Supabase fetch error:', error.message)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    // Сохраняем полученные товары в кэш Redis на 1 час
    await redis.set(REDIS_PRODUCTS_KEY, JSON.stringify(data), 'EX', 3600)

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

// POST /api/products - Создать новый товар
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, price, image_url } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url }])
      .select('*')
      .single() // .single() вернет только одну строку или null

    if (error) {
      console.error('Supabase insert error:', error.message)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    // Очищаем кэш Redis, так как данные изменились
    await redis.del(REDIS_PRODUCTS_KEY)
    console.log('Cache cleared after product creation')

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

// PUT /api/products/:id - Обновить существующий товар
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  try {
    const body = await req.json();
    const { name, description, price, image_url } = body;

    if (!productId) {
       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, image_url })
      .eq('id', productId)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error.message);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Очищаем кэш Redis, так как данные изменились
    await redis.del(REDIS_PRODUCTS_KEY);
    console.log('Cache cleared after product update');

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/products/:id error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/products/:id - Удалить товар
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  try {
    if (!productId) {
       return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      console.error('Supabase delete error:', error.message);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    // Очищаем кэш Redis, так как данные изменились
    await redis.del(REDIS_PRODUCTS_KEY);
    console.log('Cache cleared after product deletion');

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE /api/products/:id error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
