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
  amountPaid?: number
  changeReturned?: number
  timestamp: string
}

export default function ReceiptPage({ params }: { params: Promise<{ billNo: string }> }) {
  const router = useRouter()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  // Format number with commas
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

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
            <meta charset="utf-8">
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
                  height: auto;
                  margin: 0;
                  padding: 0;
                }
                .receipt-container {
                  width: 80mm !important;
                  margin: 0 auto !important;
                  padding: 5mm !important;
                }
                .cut-line {
                  page-break-after: always;
                }
              }
              
              body {
                font-family: Arial, sans-serif;
                width: 100%;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              
              .receipt-container {
                width: 80mm;
                padding: 5mm;
                font-size: 13px;
                line-height: 1.4;
                background: white;
              }
              
              .cut-line {
                page-break-after: always;
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
              
              .pb-3 { padding-bottom: 8px; }
              .mb-3 { margin-bottom: 8px; }
              .pt-3 { padding-top: 8px; }
              .mt-3 { margin-top: 8px; }
              .mb-1 { margin-bottom: 2px; }
              .mb-2 { margin-bottom: 4px; }
              .pb-1 { padding-bottom: 2px; }
              .pb-2 { padding-bottom: 4px; }
              .pt-1 { padding-top: 2px; }
              .pt-2 { padding-top: 4px; }
              .mt-2 { margin-top: 4px; }
              .p-2 { padding: 4px; }
              
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
                font-size: 16px;
                font-weight: bold;
                letter-spacing: 0.5px;
              }
              
              .text-xs {
                font-size: 12px;
              }
              
              .items-header {
                font-size: 13px;
                font-weight: bold;
                border-bottom: 2px solid #000;
                padding-bottom: 2px;
                margin-bottom: 4px;
              }
              
              .item-row {
                font-size: 12px;
                margin-bottom: 4px;
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
          setTimeout(() => {
            printWindow.close()
          }, 100)
        }, 250)
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
    let csv = `WIMALARATHNA HARDWARE Receipt\n`
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
      csv += `"${item.name}","${formatCurrency(Number(item.price))}","${item.quantity}","${formatCurrency(Number(item.total))}"\n`
    })
    csv += `\nTotal Amount,Rs. ${formatCurrency(Number(data.totalAmount))}\n`
    if (data.amountPaid !== undefined) {
      csv += `Amount Paid,Rs. ${formatCurrency(Number(data.amountPaid))}\n`
    }
    if (data.changeReturned !== undefined && data.changeReturned !== 0) {
      csv += `${data.changeReturned >= 0 ? 'Change' : 'Shortage'},Rs. ${formatCurrency(Math.abs(Number(data.changeReturned)))}\n`
    }
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
          className="bg-white text-gray-900 mx-auto"
          style={{ width: '80mm', padding: '5mm', fontSize: '13px', fontFamily: 'Arial, sans-serif', lineHeight: '1.4' }}
        >
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-2 mb-2">
            <h1 className="font-bold uppercase" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
              WIMALARATHNA HARDWARE
            </h1>
            <p style={{ fontSize: '12px', margin: '2px 0' }}>Hospital Opposite, Dompe</p>
            <p style={{ fontSize: '12px', margin: '2px 0' }}>Phone: 0112409682</p>
            <p style={{ fontSize: '12px', margin: '2px 0' }}>Email: info.wimalarathnahardware@gmail.com</p>
          </div>

          {/* Invoice Details */}
          <div className="mb-2" style={{ fontSize: '12px' }}>
            <div className="flex justify-between" style={{ marginBottom: '2px' }}>
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
          <div className="mb-2" style={{ fontSize: '12px' }}>
            <div className="flex justify-between">
              <span className="font-bold">Customer :</span>
              <span>{receipt.customerName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-2">
            <div className="border-b-2 border-gray-800 pb-1 mb-1 font-bold" style={{ fontSize: '13px' }}>
              <div className="flex">
                <span className="flex-1">Item</span>
                <span style={{ width: '35px', textAlign: 'center' }}>Qty</span>
                <span style={{ width: '50px', textAlign: 'right' }}>Price</span>
                <span style={{ width: '60px', textAlign: 'right' }}>Total</span>
              </div>
            </div>

            <div style={{ fontSize: '12px' }}>
              {receipt.items.map((item, index) => (
                <div key={item.id} style={{ marginBottom: '4px' }}>
                  <div className="flex items-start">
                    <span className="flex-1 font-semibold">{item.name}</span>
                    <span style={{ width: '35px', textAlign: 'center' }}>{item.quantity}</span>
                    <span style={{ width: '50px', textAlign: 'right' }}>
                      {formatCurrency(Number(item.price))}
                    </span>
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatCurrency(Number(item.total))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t-2 border-gray-800 pt-1 mb-2" style={{ fontSize: '13px' }}>
            <div className="flex justify-between" style={{ marginBottom: '2px' }}>
              <span>Total Items:</span>
              <span className="font-bold">
                {receipt.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between" style={{ alignItems: 'center', margin: '8px 0' }}>
              <span className="font-bold" style={{ fontSize: '15px' }}>Total Amount:</span>
              <span className="font-bold" style={{ fontSize: '22px', color: '#111827', letterSpacing: '1px' }}>Rs. {formatCurrency(Number(receipt.totalAmount))}</span>
            </div>
            {receipt.amountPaid !== undefined && (
              <>
                <div className="flex justify-between" style={{ marginTop: '4px' }}>
                  <span>Amount Paid:</span>
                  <span className="font-bold">Rs. {formatCurrency(Number(receipt.amountPaid))}</span>
                </div>
                {(() => {
                  const change = Number(receipt.amountPaid) - Number(receipt.totalAmount);
                  if (!isNaN(change) && change !== 0) {
                    return (
                      <div className="flex justify-between">
                        <span>{change >= 0 ? 'Balance:' : 'Outstanding Amount:'}</span>
                        <span className={`font-bold ${change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {change >= 0
                            ? `Rs. ${formatCurrency(Math.abs(change))}`
                            : `- Rs. ${formatCurrency(Math.abs(change))}`}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-1 mt-2" style={{ fontSize: '11px' }}>
            <p style={{ marginBottom: '4px', fontWeight: '600' }}>Thank You For Your Purchase!</p>
            <p style={{ fontSize: '10px', fontWeight: '500', margin: '2px 0' }}>Powered by HelaCode | Tel: 075 2 4 8 16 32</p>
            <p style={{ fontSize: '10px', fontWeight: '500', margin: '2px 0' }}>www.helacode.com</p>
            <div className="cut-line" style={{ borderTop: '1px dashed #000', margin: '0 auto', width: '100%' }}></div>
          </div>
        </div>
        
        {/* Empty lines after border */}
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </main>
  )
}
