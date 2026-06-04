import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Инициализация клиента PostgreSQL (Supabase)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

// In-memory кэш для списка товаров
const productCache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

const REDIS_PRODUCTS_KEY = 'products'; // Эта константа не используется с in-memory кэшем, но оставлю на всякий случай

export const maxDuration = 60

// GET /api/products - Получить список всех товаров (с кэшированием)
export async function GET(req: NextRequest) {
  try {
    // Проверяем, есть ли товары в in-memory кэше и не устарели ли они
    const cachedEntry = productCache.get(REDIS_PRODUCTS_KEY);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
      console.log('Returning products from in-memory cache');
      return NextResponse.json(cachedEntry.data);
    }

    console.log('Fetching products from Supabase');
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Сохраняем полученные товары в in-memory кэш
    productCache.set(REDIS_PRODUCTS_KEY, { data, timestamp: Date.now() });
    console.log('Products cached in-memory');

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST /api/products - Создать новый товар
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, image_url } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url }])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Очищаем in-memory кэш, так как данные изменились
    productCache.delete(REDIS_PRODUCTS_KEY);
    console.log('In-memory cache cleared after product creation');

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
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

    // Очищаем in-memory кэш, так как данные изменились
    productCache.delete(REDIS_PRODUCTS_KEY);
    console.log('In-memory cache cleared after product update');

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

    // Очищаем in-memory кэш, так как данные изменились
    productCache.delete(REDIS_PRODUCTS_KEY);
    console.log('In-memory cache cleared after product deletion');

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('DELETE /api/products/:id error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}