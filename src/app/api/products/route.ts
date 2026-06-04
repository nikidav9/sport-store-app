import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations/product'
import { z } from 'zod'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
    return NextResponse.json({ error: 'Не удалось получить товары' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = productSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Ошибка при создании товара:', error)
    return NextResponse.json({ error: 'Не удалось создать товар' }, { status: 500 })
  }
}
