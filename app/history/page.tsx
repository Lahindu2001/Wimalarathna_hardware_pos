'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Calendar, ArrowUpDown } from 'lucide-react'
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/pos')}
              className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              size="sm"
            >
              <ArrowLeft size={18} />
              Back to POS
            </Button>
            <h1 className="text-2xl font-bold flex-1">
              Bill History
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-6 bg-white shadow-md">
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
                Total: Rs. {filteredBills.reduce((sum, bill) => sum + Number(bill.total_amount), 0).toFixed(2)}
              </div>
            </div>
          </div>

          {filteredBills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-800">
                {bills.length === 0
                  ? 'No bills found. Start making sales!'
                  : 'No matching bills found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="text-gray-800 font-bold">Bill No</TableHead>
                    <TableHead className="text-gray-800 font-bold">Customer</TableHead>
                    <TableHead className="text-gray-800 font-bold">Date/Time</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold">Items</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow
                      key={bill.id}
                      className="cursor-pointer hover:bg-blue-50 border-b border-gray-200 transition-colors"
                      onClick={() => {
                        const items = Array.isArray(bill.items)
                          ? bill.items
                          : JSON.parse(bill.items as any)
                        sessionStorage.setItem(
                          `receipt_${bill.bill_no}`,
                          JSON.stringify({
                            billNo: bill.bill_no,
                            customerName: bill.customer_name,
                            items,
                            totalAmount: bill.total_amount,
                            timestamp: bill.created_at,
                          })
                        )
                        router.push(`/receipt/${bill.bill_no}`)
                      }}
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
                        {Array.isArray(bill.items)
                          ? bill.items.reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0
                            )
                          : JSON.parse(bill.items as any).reduce(
                              (sum: number, item: any) => sum + (item.quantity || 0),
                              0
                            )}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600 text-lg">
                        Rs. {Number(bill.total_amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
