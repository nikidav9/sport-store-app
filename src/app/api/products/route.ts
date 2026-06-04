import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET() {
  const products = [
    {
      id: '1',
      name: 'Футбольный мяч Nike Strike',
      price: 2500,
      description: 'Высококачественный мяч для тренировок и матчей.',
      imageUrl: '/images/nike_ball.jpg',
    },
    {
      id: '2',
      name: 'Кроссовки Adidas Ultraboost',
      price: 12000,
      description: 'Максимальный комфорт и амортизация для бега.',
      imageUrl: '/images/adidas_shoes.jpg',
    },
    {
      id: '3',
      name: 'Теннисная ракетка Babolat Pure Aero',
      price: 15000,
      description: 'Идеальный выбор для мощных ударов.',
      imageUrl: '/images/babolat_racket.jpg',
    },
    {
      id: '4',
      name: 'Комплект для фитнеса Puma',
      price: 7000,
      description: 'Включает леггинсы, топ и спортивный бюстгальтер.',
      imageUrl: '/images/puma_kit.jpg',
    },
    {
      id: '5',
      name: 'Спортивная бутылка Hydro Flask',
      price: 1500,
      description: 'Сохраняет напитки холодными до 24 часов.',
      imageUrl: '/images/hydroflask.jpg',
    },
  ];
  return NextResponse.json(products);
}
