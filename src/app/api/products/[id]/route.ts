
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import redisClient from '@/lib/redis';

const PRODUCTS_CACHE_KEY = 'products';

// GET /api/products/[id] - Получить товар по ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Supabase error fetching product ${id}:`, error);
      if (error.code === 'PGRST116') { // No Row Found
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Обновить товар
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, description, price } = body;

    if (!name && !description && !price) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    const updateData: { name?: string; description?: string; price?: number; updated_at: string } = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('id, name, description, price, created_at, updated_at')
      .single();

    if (error) {
      console.error(`Supabase error updating product ${id}:`, error);
      if (error.code === 'PGRST116') { // No Row Found
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    // Инвалидируем кэш
    await redisClient.del(PRODUCTS_CACHE_KEY);
    console.log(`Cache invalidated after product update (ID: ${id})`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Удалить товар
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Supabase error deleting product ${id}:`, error);
       if (error.code === 'PGRST116') { // No Row Found
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    // Инвалидируем кэш
    await redisClient.del(PRODUCTS_CACHE_KEY);
    console.log(`Cache invalidated after product deletion (ID: ${id})`);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
