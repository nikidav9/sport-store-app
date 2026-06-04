
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import redisClient from '@/lib/redis';

const PRODUCTS_CACHE_KEY = 'products';
const CACHE_TTL_SECONDS = 300; // 5 minutes

// GET /api/products - Получить список товаров (с кэшированием)
export async function GET() {
  try {
    const cachedProducts = await redisClient.get(PRODUCTS_CACHE_KEY);
    if (cachedProducts) {
      console.log('Serving products from cache');
      return NextResponse.json(JSON.parse(cachedProducts));
    }

    console.log('Fetching products from Supabase');
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Кэшируем результат в Redis
    await redisClient.set(PRODUCTS_CACHE_KEY, JSON.stringify(data), 'EX', CACHE_TTL_SECONDS);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Redis or other error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST /api/products - Создать новый товар
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price } = body;

    if (!name || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price }])
      .select('id, name, description, price, created_at, updated_at')
      .single();

    if (error) {
      console.error('Supabase error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Инвалидируем кэш
    await redisClient.del(PRODUCTS_CACHE_KEY);
    console.log('Cache invalidated after product creation');

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
