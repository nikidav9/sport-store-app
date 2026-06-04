import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.number().positive('Цена должна быть положительной'),
  imageUrl: z.string().url('Неверный URL изображения').optional().or(z.literal('')),
})

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Название обязательно').optional(),
  description: z.string().optional(),
  price: z.number().positive('Цена должна быть положительной').optional(),
  imageUrl: z.string().url('Неверный URL изображения').optional().or(z.literal('')),
})
