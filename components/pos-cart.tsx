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
    <div className="h-full flex flex-col">
      {/* Cart Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Cart</h2>
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
            {itemCount} Items
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-800 p-8">
          <ShoppingCart size={64} className="mb-4 opacity-30" />
          <p className="text-lg">Cart is empty</p>
          <p className="text-sm">Add items to begin</p>
        </div>
      ) : (
        <>
          {/* Total and Checkout - Moved to Top */}
          <div className="bg-white border-b-4 border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200">
              <span className="text-gray-600 font-semibold text-lg">Total:</span>
              <span className="text-3xl font-bold text-blue-600">
                Rs. {total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 text-sm text-gray-800">
              <span>Products: {productCount}</span>
              <span>|</span>
              <span>Items: {itemCount}</span>
              <span>|</span>
              <span>Subtotal: Rs. {total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-xl font-bold shadow-lg transition-all active:scale-95"
              disabled={items.length === 0 || loading}
              tabIndex={2}
            >
              {loading ? 'Processing...' : (
                <span className="flex items-center justify-center gap-3">
                  Checkout <Kbd className="bg-white text-green-600 text-base">F9</Kbd>
                </span>
              )}
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {editingPrice === item.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={priceValue}
                          onChange={(e) => setPriceValue(e.target.value)}
                          onBlur={() => handlePriceSave(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePriceSave(item.id)
                            if (e.key === 'Escape') {
                              setEditingPrice(null)
                              setPriceValue('')
                            }
                          }}
                          className="w-24 h-7 text-sm"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handlePriceEdit(item)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          Rs. {Number(item.price).toFixed(2)}
                        </button>
                      )}
                      <span className="text-gray-800 text-sm">×</span>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-base font-bold text-gray-800">
                      Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded font-bold transition-colors"
                    disabled={loading}
                    tabIndex={3}
                  >
                    <Minus size={16} className="mx-auto" />
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
                    className="w-16 text-center font-bold text-lg h-10 border-2 border-gray-300 focus:border-blue-500"
                    tabIndex={3}
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded font-bold transition-colors"
                    disabled={loading}
                    tabIndex={3}
                  >
                    <Plus size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
