import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export const maxDuration = 60

// Инициализация клиента PostgreSQL (Supabase)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

// Временная схема для валидации, если нет отдельного файла
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image_url: z.string().url().optional(),
});

interface ProductRouteContext {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: ProductRouteContext) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error(`Supabase fetch error for product ${params.id}:`, error.message)
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(`Ошибка при получении товара ${params.id}:`, error)
    return NextResponse.json({ error: 'Не удалось получить товар' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: ProductRouteContext) {
  try {
    const body = await req.json()
    const validatedData = updateProductSchema.parse(body)

    const { data: product, error } = await supabase
      .from('products')
      .update(validatedData)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) {
      console.error(`Supabase update error for product ${params.id}:`, error.message)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(`Ошибка при обновлении товара ${params.id}:`, error)
    return NextResponse.json({ error: 'Не удалось обновить товар' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: ProductRouteContext) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error(`Supabase delete error for product ${params.id}:`, error.message)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Ошибка при удалении товара ${params.id}:`, error)
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 500 })
  }
}