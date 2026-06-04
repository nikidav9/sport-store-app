import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateProductSchema } from '@/lib/validations/product'
import { z } from 'zod'

export const maxDuration = 60

interface ProductRouteContext {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: ProductRouteContext) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

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

    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
    })

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
    await prisma.product.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Ошибка при удалении товара ${params.id}:`, error)
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 500 })
  }
}
