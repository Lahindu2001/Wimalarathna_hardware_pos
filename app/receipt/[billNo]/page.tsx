'use client'

import { useEffect, useRef, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Printer, Home, Download } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

interface ReceiptData {
  billNo: string
  customerName: string
  items: {
    id: number
    name: string
    price: number
    quantity: number
    total: number
  }[]
  totalAmount: number
  timestamp: string
}

export default function ReceiptPage({ params }: { params: Promise<{ billNo: string }> }) {
  const router = useRouter()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    const billNo = decodeURIComponent(resolvedParams.billNo)
    const storedReceipt = sessionStorage.getItem(`receipt_${billNo}`)

    if (storedReceipt) {
      const data = JSON.parse(storedReceipt)
      setReceipt(data)
      sessionStorage.removeItem(`receipt_${billNo}`)
      // Auto print after a short delay
      setTimeout(() => handlePrint(), 500)
    } else {
      // Fallback: try to fetch from API if needed
      setLoading(false)
    }
    setLoading(false)
  }, [resolvedParams.billNo])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC key to return to POS
      if (e.key === 'Escape') {
        e.preventDefault()
        router.push('/pos')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router])

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Receipt - ${receipt?.billNo}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              @page {
                size: 80mm auto;
                margin: 0mm;
              }
              
              @media print {
                html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .receipt-container {
                  width: 80mm !important;
                  margin: auto !important;
                  padding: 8mm !important;
                }
              }
              
              body {
                font-family: 'Courier New', Courier, monospace;
                width: 100%;
                height: 100vh;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              .receipt-container {
                width: 80mm;
                padding: 8mm;
                font-size: 11px;
                line-height: 1.4;
                background: white;
                border: 2px solid #000;
              }
              
              .text-center {
                text-align: center;
              }
              
              .border-b-2 {
                border-bottom: 2px solid #000;
              }
              
              .border-t-2 {
                border-top: 2px solid #1f2937;
              }
              
              .border-dashed {
                border-style: dashed;
              }
              
              .border-gray-800 {
                border-color: #1f2937;
              }
              
              .border-gray-700 {
                border-color: #374151;
              }
              
              .text-gray-900 {
                color: #111827;
              }
              
              .pb-3 { padding-bottom: 12px; }
              .mb-3 { margin-bottom: 12px; }
              .pt-3 { padding-top: 12px; }
              .mt-3 { margin-top: 12px; }
              .mb-1 { margin-bottom: 4px; }
              .mb-2 { margin-bottom: 8px; }
              .pb-1 { padding-bottom: 4px; }
              .pt-2 { padding-top: 8px; }
              .p-2 { padding: 8px; }
              
              .font-bold {
                font-weight: bold;
              }
              
              .uppercase {
                text-transform: uppercase;
              }
              
              .flex {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
              
              .flex-1 {
                flex: 1;
              }
              
              .header-title {
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 1px;
              }
              
              .text-xs {
                font-size: 10px;
              }
              
              .items-header {
                font-size: 11px;
                font-weight: bold;
                border-bottom: 2px solid #000;
                padding-bottom: 4px;
                margin-bottom: 8px;
              }
              
              .item-row {
                font-size: 10px;
                margin-bottom: 8px;
              }
              
              .grand-total-box {
                border: 2px solid #000;
                padding: 8px;
                text-align: center;
                margin-bottom: 12px;
              }
              
              .grand-total-label {
                font-size: 10px;
                margin-bottom: 4px;
              }
              
              .grand-total-amount {
                font-size: 16px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${receiptRef.current.innerHTML}
            </div>
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          // Auto-navigate to POS after printing
          setTimeout(() => {
            router.push('/pos')
          }, 500)
        }, 500)
      }
    }
  }

  const handleDownload = () => {
    if (receipt) {
      const csv = generateCSV(receipt)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt_${receipt.billNo}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const generateCSV = (data: ReceiptData): string => {
    let csv = `Wimalarathne Hardware Receipt\n`
    csv += `Bill Number: ${data.billNo}\n`
    csv += `Customer: ${data.customerName}\n`
    csv += `Date: ${new Date(data.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })}\n`
    csv += `\nProduct,Price,Quantity,Total\n`
    data.items.forEach((item) => {
      csv += `"${item.name}","${Number(item.price).toFixed(2)}","${item.quantity}","${Number(item.total).toFixed(2)}"\n`
    })
    csv += `\nTotal Amount,Rs. ${Number(data.totalAmount).toFixed(2)}\n`
    return csv
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading receipt...</p>
        </div>
      </main>
    )
  }

  if (!receipt) {
    return (
      <main className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-foreground mb-4">Receipt not found</p>
            <Button onClick={() => router.push('/pos')}>
              Return to POS
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex gap-2 justify-end">
          <Button onClick={handlePrint} className="gap-2">
            <Printer size={18} />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="gap-2 bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-100">
            <Download size={18} />
            Download
          </Button>
          <Button variant="outline" onClick={() => router.push('/pos')} className="gap-2">
            <Home size={18} />
            <span className="flex items-center gap-2">
              Return to POS <Kbd>ESC</Kbd>
            </span>
          </Button>
        </div>

        {/* Thermal Receipt Style - 80mm width */}
        <div
          ref={receiptRef}
          className="bg-white text-gray-900 mx-auto font-mono leading-tight border-2 border-gray-300 shadow-lg"
          style={{ width: '80mm', padding: '8mm', fontSize: '11px' }}
        >
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
            <h1 className="font-bold uppercase" style={{ fontSize: '18px', letterSpacing: '1px' }}>
              WIMALARATHNE HARDWARE
            </h1>
            <p className="text-xs mt-1">213/1F, Medalanda, Dompe</p>
            <p className="text-xs">Phone: 0778-683-489</p>
            <p className="text-xs">Email: wimalarathne@hardware.lk</p>
          </div>

          {/* Invoice Details */}
          <div className="mb-3" style={{ fontSize: '11px' }}>
            <div className="flex justify-between mb-1">
              <span className="font-bold">Invoice# :</span>
              <span>{receipt.billNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Date :</span>
              <span>
                {new Date(receipt.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border-t border-b border-dashed border-gray-700 py-2 mb-3" style={{ fontSize: '11px' }}>
            <div className="mb-1">
              <span className="font-bold">Customer Name : </span>
              <span>{receipt.customerName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-3">
            <div className="border-b-2 border-gray-800 pb-1 mb-2 font-bold" style={{ fontSize: '11px' }}>
              <div className="flex">
                <span className="flex-1">Item</span>
                <span style={{ width: '35px', textAlign: 'center' }}>Qty</span>
                <span style={{ width: '50px', textAlign: 'right' }}>Price</span>
                <span style={{ width: '60px', textAlign: 'right' }}>Total</span>
              </div>
            </div>

            <div style={{ fontSize: '10px' }}>
              {receipt.items.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="flex items-start">
                    <span className="flex-1 font-semibold">{item.name}</span>
                    <span style={{ width: '35px', textAlign: 'center' }}>{item.quantity}</span>
                    <span style={{ width: '50px', textAlign: 'right' }}>
                      {Number(item.price).toFixed(2)}
                    </span>
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                      {Number(item.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t-2 border-gray-800 pt-2 mb-3" style={{ fontSize: '11px' }}>
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span className="font-bold">Rs. {Number(receipt.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Total Items:</span>
              <span className="font-bold">
                {receipt.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-2 border-gray-800 p-2 mb-3 text-center">
            <div className="text-xs mb-1">GRAND TOTAL</div>
            <div className="font-bold" style={{ fontSize: '16px' }}>
              Rs. {Number(receipt.totalAmount).toFixed(2)}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-dashed border-gray-700 pt-3" style={{ fontSize: '10px' }}>
            <p className="mb-2 font-semibold">Thank You For Your Purchase!</p>
            <p className="mb-1">Please retain this receipt for warranty claims</p>
            <p className="text-xs mt-2">
              Printed: {new Date().toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
