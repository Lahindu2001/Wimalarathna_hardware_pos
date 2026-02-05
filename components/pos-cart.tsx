'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface POSCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onCheckout: (customerName: string) => void
  onUpdatePrice?: (id: number, price: number) => void
  loading?: boolean
}

export function POSCart({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onUpdatePrice,
  loading = false,
}: POSCartProps) {
  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [priceValue, setPriceValue] = useState('')
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const productCount = items.length

  // Keyboard shortcuts for last item in cart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger when typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const lastItem = items[items.length - 1]
      if (!lastItem) return

      // + key to increase quantity of last item
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        onUpdateQuantity(lastItem.id, lastItem.quantity + 1)
      }
      
      // - key to decrease quantity of last item
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        onUpdateQuantity(lastItem.id, lastItem.quantity - 1)
      }

      // Delete/Backspace to remove last item
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onRemove(lastItem.id)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [items, onUpdateQuantity, onRemove])

  const handleCheckout = () => {
    const customerName = prompt('Enter customer name:')
    if (customerName !== null) {
      onCheckout(customerName || 'Walk-in')
    }
  }

  const handlePriceEdit = (item: CartItem) => {
    setEditingPrice(item.id)
    setPriceValue(item.price.toString())
  }

  const handlePriceSave = (id: number) => {
    const newPrice = parseFloat(priceValue)
    if (!isNaN(newPrice) && newPrice > 0 && onUpdatePrice) {
      onUpdatePrice(id, newPrice)
    }
    setEditingPrice(null)
    setPriceValue('')
  }

  return (
    <div className="h-full flex flex-col bg-white border-l-2 border-slate-200">
      {/* Fixed Receipt Header */}
      <div className="bg-slate-50 border-b-2 border-slate-300 px-4 py-3 flex-shrink-0">
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800">BILL</h2>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-600 mt-1">
            <span>{productCount} Products</span>
            <span>•</span>
            <span>{itemCount} Items</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6">
          <ShoppingCart size={48} className="mb-3 opacity-20" />
          <p className="text-sm font-semibold text-slate-500">No items</p>
        </div>
      ) : (
        <>
          {/* Scrollable Receipt Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="border-b border-dashed border-slate-300 pb-2 last:border-0"
                >
                  {/* Item Name Row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-600">{index + 1}.</span>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">
                        {item.name}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded"
                      disabled={loading}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {/* Bill Line: Qty × Price = Total */}
                  <div className="flex items-center justify-between text-xs pl-5">
                    <div className="flex items-center gap-2">
                      {/* Quantity with small controls */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-4 h-4 bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 rounded flex items-center justify-center text-xs font-bold"
                          disabled={loading}
                          tabIndex={-1}
                        >
                          −
                        </button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value)
                            if (!isNaN(qty) && qty > 0) {
                              onUpdateQuantity(item.id, qty)
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-8 text-center font-mono font-bold text-xs h-4 border border-slate-300 focus:border-blue-500 bg-white rounded px-0"
                          tabIndex={4}
                        />
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-4 h-4 bg-slate-200 hover:bg-green-500 hover:text-white text-slate-600 rounded flex items-center justify-center text-xs font-bold"
                          disabled={loading}
                          tabIndex={-1}
                        >
                          +
                        </button>
                      </div>
                      
                      <span className="text-slate-500">×</span>
                      
                      {/* Price (editable) */}
                      {editingPrice === item.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={priceValue}
                          onChange={(e) => setPriceValue(e.target.value)}
                          onBlur={() => handlePriceSave(item.id)}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePriceSave(item.id)
                            if (e.key === 'Escape') {
                              setEditingPrice(null)
                              setPriceValue('')
                            }
                          }}
                          className="w-20 h-5 text-xs bg-white text-slate-900 border border-blue-500 rounded px-1"
                          tabIndex={3}
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handlePriceEdit(item)}
                          className="text-blue-600 hover:underline font-mono"
                        >
                          {Number(item.price).toFixed(2)}
                        </button>
                      )}
                    </div>
                    
                    {/* Line Total */}
                    <span className="font-mono font-bold text-slate-800">
                      {(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Receipt Footer - Total & Checkout */}
          <div className="border-t-2 border-slate-300 bg-slate-50 px-4 py-3 flex-shrink-0">
            {/* Receipt Total Lines */}
            <div className="space-y-1 mb-3 font-mono text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="border-t-2 border-dashed border-slate-400 pt-2 flex justify-between font-bold text-base text-slate-900">
                <span>TOTAL:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Compact Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm font-bold rounded shadow-md"
              disabled={items.length === 0 || loading}
              tabIndex={2}
            >
              {loading ? 'Processing...' : (
                <span className="flex items-center justify-center gap-2">
                  CHECKOUT <Kbd className="bg-white text-green-700 text-xs px-2 py-0.5">F9</Kbd>
                </span>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
