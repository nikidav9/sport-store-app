import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
}

const cache = new Map<string, { data: unknown; expiresAt: number }>()
const CACHE_TTL = 60 * 60 * 1000

function getCache(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null }
  return entry.data
}
function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL })
}

export async function GET() {
  const cached = getCache('products')
  if (cached) return NextResponse.json(cached)

  const { data, error } = await getSupabase().from('products').select('*')
  if (error) return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })

  setCache('products', data)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, price, image_url } = body

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from('products')
    .insert([{ name, description, price, image_url }])
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })

  cache.delete('products')
  return NextResponse.json(data, { status: 201 })
}
