import { NextRequest, NextResponse } from 'next/server'
import { createBill, getProduct, updateProductStock } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Generate unique bill number
function generateBillNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BL-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { customerName, items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Validate stock and calculate total
    let totalAmount = 0
    const billItems = []

    for (const item of items) {
      const product = await getProduct(item.id)

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      billItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      })

      // Update stock
      await updateProductStock(product.id, product.stock - item.quantity)
    }

    // Create bill
    const billNo = generateBillNo()
    const bill = await createBill(billNo, customerName || 'Walk-in', billItems, totalAmount)

    return NextResponse.json({
      billNo: bill.bill_no,
      customerName: bill.customer_name,
      items: billItems,
      totalAmount,
      timestamp: bill.created_at,
    })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
