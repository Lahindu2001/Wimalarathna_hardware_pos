'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/app-header'
import { Search, Calendar, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface BillItem {
  id: number
  name: string
  price: number
  quantity: number
  total: number
}

interface Bill {
  id: number
  bill_no: string
  customer_name: string
  items: BillItem[]
  total_amount: number
  amount_paid: number | null
  change_returned: number | null
  created_at: string
}

type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'
type SortOrder = 'newest' | 'oldest'

export default function HistoryPage() {
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expandedBillId, setExpandedBillId] = useState<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchBills()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus search on Ctrl+/
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills')
      if (!res.ok) throw new Error('Failed to fetch bills')
      const data = await res.json()
      setBills(data)
    } catch (error) {
      console.error('[v0] Failed to fetch bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const filteredBills = bills.filter((bill) => {
    // Search filter
    const matchesSearch = bill.bill_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    // Date filter
    const billDate = new Date(bill.created_at)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (dateFilter) {
      case 'today':
        const todayEnd = new Date(today)
        todayEnd.setHours(23, 59, 59, 999)
        return billDate >= today && billDate <= todayEnd
      
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayEnd = new Date(yesterday)
        yesterdayEnd.setHours(23, 59, 59, 999)
        return billDate >= yesterday && billDate <= yesterdayEnd
      
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return billDate >= weekAgo
      
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return billDate >= monthAgo
      
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0)
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999)
          return billDate >= start && billDate <= end
        }
        return true
      
      case 'all':
      default:
        return true
    }
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading bill history...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Page Title Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-3 md:px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900">Bill History</h2>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        <Card className="p-3 md:p-6 bg-white shadow-md">
          {/* Filters Section */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search by bill number or customer name... (Ctrl+/)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Date Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              <Calendar size={18} className="text-gray-600" />
              <Button
                size="sm"
                variant={dateFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setDateFilter('all')}
                className={dateFilter === 'all' ? 'bg-blue-600' : ''}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={dateFilter === 'today' ? 'default' : 'outline'}
                onClick={() => setDateFilter('today')}
                className={dateFilter === 'today' ? 'bg-blue-600' : ''}
              >
                Today
              </Button>
              <Button
                size="sm"
                variant={dateFilter === 'yesterday' ? 'default' : 'outline'}
                onClick={() => setDateFilter('yesterday')}
                className={dateFilter === 'yesterday' ? 'bg-blue-600' : ''}
              >
                Yesterday
              </Button>
              <Button
                size="sm"
                variant={dateFilter === 'week' ? 'default' : 'outline'}
                onClick={() => setDateFilter('week')}
                className={dateFilter === 'week' ? 'bg-blue-600' : ''}
              >
                Last 7 Days
              </Button>
              <Button
                size="sm"
                variant={dateFilter === 'month' ? 'default' : 'outline'}
                onClick={() => setDateFilter('month')}
                className={dateFilter === 'month' ? 'bg-blue-600' : ''}
              >
                Last 30 Days
              </Button>
              <Button
                size="sm"
                variant={dateFilter === 'custom' ? 'default' : 'outline'}
                onClick={() => setDateFilter('custom')}
                className={dateFilter === 'custom' ? 'bg-blue-600' : ''}
              >
                Custom Range
              </Button>
              
              <div className="ml-auto flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-600" />
                <Button
                  size="sm"
                  variant={sortOrder === 'newest' ? 'default' : 'outline'}
                  onClick={() => setSortOrder('newest')}
                  className={sortOrder === 'newest' ? 'bg-blue-600' : ''}
                >
                  Newest First
                </Button>
                <Button
                  size="sm"
                  variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                  onClick={() => setSortOrder('oldest')}
                  className={sortOrder === 'oldest' ? 'bg-blue-600' : ''}
                >
                  Oldest First
                </Button>
              </div>
            </div>

            {/* Custom Date Range */}
            {dateFilter === 'custom' && (
              <div className="flex gap-4 items-center pl-6 border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2 border-gray-300 text-gray-900 bg-white h-10"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2 border-gray-300 text-gray-900 bg-white h-10"
                  />
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <div className="text-sm text-gray-800 font-semibold">
                Showing {filteredBills.length} of {bills.length} bills
              </div>
              <div className="text-lg font-bold text-blue-600">
                Total: Rs. {formatCurrency(filteredBills.reduce((sum, bill) => sum + Number(bill.total_amount), 0))}
              </div>
            </div>
          </div>

          {filteredBills.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-gray-800">
                {bills.length === 0
                  ? 'No bills found. Start making sales!'
                  : 'No matching bills found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="text-gray-800 font-bold text-xs sm:text-sm">Bill No</TableHead>
                    <TableHead className="text-gray-800 font-bold text-xs sm:text-sm">Customer</TableHead>
                    <TableHead className="text-gray-800 font-bold text-xs sm:text-sm">Date/Time</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold text-xs sm:text-sm">Items</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold text-xs sm:text-sm">Total</TableHead>
                    <TableHead className="text-center text-gray-800 font-bold text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => {
                    const items = Array.isArray(bill.items)
                      ? bill.items
                      : JSON.parse(bill.items as any)
                    const isExpanded = expandedBillId === bill.id
                    
                    return (
                      <React.Fragment key={bill.id}>
                        <TableRow
                          className="hover:bg-blue-50 border-b border-gray-200 transition-colors"
                        >
                          <TableCell className="font-mono font-bold text-blue-600">
                            {bill.bill_no}
                          </TableCell>
                          <TableCell className="text-gray-800">{bill.customer_name}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(bill.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </TableCell>
                          <TableCell className="text-right text-gray-800">
                            {items.reduce(
                              (sum: number, item: BillItem) => sum + Math.ceil(item.quantity || 0),
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600 text-lg">
                            Rs. {formatCurrency(Number(bill.total_amount))}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setExpandedBillId(isExpanded ? null : bill.id)}
                                className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3"
                              >
                                {isExpanded ? 'Hide Details' : 'Show Details'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  sessionStorage.setItem(
                                    `receipt_${bill.bill_no}`,
                                    JSON.stringify({
                                      billNo: bill.bill_no,
                                      customerName: bill.customer_name,
                                      items,
                                      totalAmount: bill.total_amount,
                                      amountPaid: bill.amount_paid,
                                      changeReturned: bill.change_returned,
                                      timestamp: bill.created_at,
                                    })
                                  )
                                  router.push(`/receipt/${bill.bill_no}`)
                                }}
                                className="bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-3"
                              >
                                View Receipt
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${bill.id}-details`} className="bg-gray-50">
                            <TableCell colSpan={6} className="p-6">
                              <div className="space-y-4">
                                {/* Items List */}
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Items</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-gray-200">
                                        <TableHead className="text-gray-800 font-bold">Product</TableHead>
                                        <TableHead className="text-right text-gray-800 font-bold">Price</TableHead>
                                        <TableHead className="text-right text-gray-800 font-bold">Qty</TableHead>
                                        <TableHead className="text-right text-gray-800 font-bold">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {items.map((item: BillItem, idx: number) => (
                                        <TableRow key={idx} className="border-b">
                                          <TableCell className="text-gray-800 font-medium">{item.name}</TableCell>
                                          <TableCell className="text-right text-gray-700">Rs. {formatCurrency(item.price)}</TableCell>
                                          <TableCell className="text-right text-gray-700">{item.quantity}</TableCell>
                                          <TableCell className="text-right text-gray-900 font-semibold">Rs. {formatCurrency(item.total)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Payment Details */}
                                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                                  <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Details</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                                      <p className="text-sm text-gray-600 font-semibold mb-1">Subtotal</p>
                                      <p className="text-2xl font-bold text-gray-900">Rs. {formatCurrency(Number(bill.total_amount))}</p>
                                    </div>
                                    {bill.amount_paid !== null && (
                                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Amount Paid</p>
                                        <p className="text-2xl font-bold text-blue-600">Rs. {formatCurrency(Number(bill.amount_paid))}</p>
                                      </div>
                                    )}
                                    {bill.change_returned !== null && (
                                      <div className={`bg-white p-4 rounded-lg border-2 ${Number(bill.change_returned) >= 0 ? 'border-green-300' : 'border-red-300'}`}>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                          {Number(bill.change_returned) >= 0 ? 'Change' : 'Shortage'}
                                        </p>
                                        <p className={`text-2xl font-bold ${Number(bill.change_returned) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          Rs. {formatCurrency(Math.abs(Number(bill.change_returned)))}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
