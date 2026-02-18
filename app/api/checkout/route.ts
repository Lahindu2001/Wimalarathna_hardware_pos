import { NextRequest, NextResponse } from 'next/server'
import { createBill, getProduct, updateProductStock, getLastBillNumber } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Generate unique bill number with WH prefix and sequential number
async function generateBillNo(): Promise<string> {
  const lastBillNo = await getLastBillNumber()
  
  if (!lastBillNo) {
    // First bill
    return 'WH00001'
  }
  
  // Extract number from last bill (e.g., "WH00001" -> 1)
  const match = lastBillNo.match(/WH(\d+)/)
  if (match) {
    const lastNumber = parseInt(match[1], 10)
    const nextNumber = lastNumber + 1
    // Format with 5 digits and leading zeros
    return `WH${nextNumber.toString().padStart(5, '0')}`
  }
  
  // Fallback if format doesn't match
  return 'WH00001'
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

    const { customerName, items, amountPaid, changeReturned, customerReturnBalance, enableReturnBalance } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Validate stock and calculate totals
    let subtotal = 0
    let totalDiscount = 0
    const billItems = []

    for (const item of items) {
      // Validate quantity as positive decimal
      const qty = parseFloat(item.quantity)
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for item ${item.name || item.id}` },
          { status: 400 }
        );
      }
      // Handle 'other' product (id null)
      if (item.id === null || item.id === undefined) {
        const discount = item.discount ?? 0;
        const itemTotal = item.price * qty;
        const itemDiscount = item.price * qty * discount / 100;
        subtotal += itemTotal;
        totalDiscount += itemDiscount;
        billItems.push({
          id: null,
          name: item.name || 'other',
          price: item.price,
          quantity: qty,
          total: itemTotal,
          discount: discount,
        });
        // No stock update for 'other'
        continue;
      }
      const product = await getProduct(item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 404 }
        );
      }
      if (qty > product.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      const discount = item.discount ?? 0;
      const itemTotal = item.price * qty;
      const itemDiscount = item.price * qty * discount / 100;
      subtotal += itemTotal;
      totalDiscount += itemDiscount;
      billItems.push({
        id: product.id,
        name: product.name,
        price: item.price, // use cart price
        quantity: qty,
        total: itemTotal,
        discount: discount,
      });
      // Update stock
      await updateProductStock(product.id, product.stock - qty);
    }

    const totalAmount = subtotal - totalDiscount

    // Create bill
    const billNo = await generateBillNo()
    const bill = await createBill(
      billNo, 
      customerName || 'Walk-in', 
      billItems, 
      totalAmount,
      totalDiscount,
      amountPaid || totalAmount,
      changeReturned !== undefined ? changeReturned : 0,
      customerReturnBalance !== undefined ? customerReturnBalance : 0,
      enableReturnBalance === true
    )

    return NextResponse.json({
      billNo: bill.bill_no,
      customerName: bill.customer_name,
      items: billItems,
      totalAmount,
      billDiscount: bill.bill_discount,
      amountPaid: bill.amount_paid,
      changeReturned: bill.change_returned,
      customerReturnBalance: bill.customer_return_balance,
      enableReturnBalance: bill.enable_return_balance,
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
