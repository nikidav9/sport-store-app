import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { updateProductSchema } from '@/lib/validations/product'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
}

interface ProductRouteContext {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: ProductRouteContext) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: ProductRouteContext) {
  try {
    const supabase = getSupabase()
    const body = await req.json()
    const validatedData = updateProductSchema.parse(body)

    const { data, error } = await supabase
      .from('products')
      .update(validatedData)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Не удалось обновить товар' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: ProductRouteContext) {
  const supabase = getSupabase()
  const { error } = await supabase.from('products').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
