import { createProduct } from '@/lib/db'
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { name, price, stock } = await request.json();
    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Name and price required' }, { status: 400 });
    }
    const product = await createProduct(name, price, stock ?? 9999);
    return NextResponse.json(product);
  } catch (error) {
    console.error('[v0] Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('[v0] Products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
