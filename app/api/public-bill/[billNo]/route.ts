import { NextRequest, NextResponse } from 'next/server'
import { getBillByNumber } from '@/lib/db'

export async function GET(request: NextRequest) {
  const billNo = request.url.split('/').pop()
  if (!billNo) {
    return NextResponse.json({ error: 'Missing bill number' }, { status: 400 })
  }
  try {
    const bill = await getBillByNumber(billNo)
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }
    return NextResponse.json(bill)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
