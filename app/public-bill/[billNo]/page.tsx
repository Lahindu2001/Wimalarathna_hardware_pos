import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getBillData(billNo: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/public-bill/${billNo}`)
  if (!res.ok) return null
  return await res.json()
}

export default async function PublicBillPage({ params }: { params: { billNo: string } }) {
  const bill = await getBillData(params.billNo)
  if (!bill) return notFound()

  return (
    <html>
      <head>
        <title>Bill {bill.bill_no}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { font-family: Arial, sans-serif; background: #fff; color: #111; margin: 0; padding: 0; }
          .container { max-width: 400px; margin: 24px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 24px; }
          .header { text-align: center; margin-bottom: 16px; }
          .items { margin-bottom: 16px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 4px; }
          .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 12px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h2>WIMALARATHNA HARDWARE</h2>
            <div>Bill No: {bill.bill_no}</div>
            <div>Date: {new Date(bill.created_at).toLocaleString()}</div>
            <div>Customer: {bill.customer_name}</div>
          </div>
          <div className="items">
            {(bill.items || []).map((item: any, idx: number) => (
              <div className="item" key={idx}>
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>Rs. {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="total">Total: Rs. {bill.total_amount.toFixed(2)}</div>
        </div>
      </body>
    </html>
  )
}
