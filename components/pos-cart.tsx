'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  discount?: number // Discount percentage (0-100)
}

interface POSCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onCheckout: (customerName: string, amountPaid: number, changeReturned: number, customerReturnBalance?: number, enableReturnBalance?: boolean) => void
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
  // Format number with commas
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [priceValue, setPriceValue] = useState('')
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  // Customer Return Balance state
  const [customerReturnBalance, setCustomerReturnBalance] = useState('0')
  const [enableReturnBalance, setEnableReturnBalance] = useState(false)

  // Subtotal before discount
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Total discount amount
  const totalDiscount = items.reduce((sum, item) => {
    const discount = item.discount ?? 0;
    return sum + (item.price * item.quantity * discount / 100);
  }, 0)
  // Final total after discount
  const total = subtotal - totalDiscount
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const productCount = items.length

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      alert('Cart is empty')
      return
    }
    setShowCheckoutDialog(true)
    setCustomerName('')
    setAmountPaid('')
    setCustomerReturnBalance('0')
    setEnableReturnBalance(false)
  }, [items.length])

  const handleConfirmCheckout = () => {
    let paid = parseFloat(amountPaid)
    let returnBalance = parseFloat(customerReturnBalance)
    if (enableReturnBalance) {
      if (isNaN(returnBalance)) returnBalance = 0
      paid = returnBalance
    }
    if (isNaN(paid) || paid < 0) {
      alert('Please enter a valid amount')
      return
    }

    const amountDue = paid - total

    // Payment is short
    if (amountDue < 0) {
      const shortage = Math.abs(amountDue)
      const confirmShort = confirm(
        `⚠️ PAYMENT SHORT\n\n` +
        `Subtotal: Rs. ${formatCurrency(total)}\n` +
        `Amount Paid: Rs. ${formatCurrency(paid)}\n` +
        `Shortage: Rs. ${formatCurrency(shortage)}\n\n` +
        `Proceed with partial payment?`
      )
      if (!confirmShort) return
    }

    // Payment is exact or overpaid
    if (amountDue >= 0) {
      const change = amountDue
      if (change > 0) {
        alert(
          `✓ PAYMENT CONFIRMED\n\n` +
          `Change to return: Rs. ${formatCurrency(change)}`
        )
      } else {
        alert('✓ PAYMENT CONFIRMED\n\nExact amount received.')
      }
    }

    onCheckout(
      customerName || 'Walk-in',
      paid,
      amountDue,
      enableReturnBalance ? parseFloat(customerReturnBalance) : undefined,
      enableReturnBalance
    )
    setShowCheckoutDialog(false)
    setCustomerName('')
    setAmountPaid('')
    setCustomerReturnBalance('0')
    setEnableReturnBalance(false)
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

  // Keyboard shortcuts for last item in cart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F9 for checkout - always works even when typing in input
      if (e.key === 'F9' && items.length > 0) {
        e.preventDefault()
        handleCheckout()
        return
      }

      // Don't trigger other shortcuts when typing in input
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
  }, [items, onUpdateQuantity, onRemove, handleCheckout])

  return (
    <div className="h-full flex flex-col bg-white border-l-0 lg:border-l-2 border-slate-200">
      {/* Cart Top Bar: Total & Checkout */}
      <div className="flex items-center justify-between bg-slate-50 border-b-2 border-slate-300 px-2 sm:px-3 md:px-4 py-2 sm:py-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">BILL</h2>
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-600 mt-1">
            <span>{productCount} Products</span>
            <span>•</span>
            <span>{itemCount} Items</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono font-bold text-base sm:text-lg text-slate-900">TOTAL: Rs. {formatCurrency(total)}</span>
          <Button
            onClick={handleCheckout}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-xs sm:text-sm font-bold rounded shadow-md"
            disabled={items.length === 0 || loading}
            tabIndex={2}
            style={{ minWidth: 100 }}
          >
            {loading ? 'Processing...' : (
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                CHECKOUT <Kbd className="bg-white text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">F9</Kbd>
              </span>
            )}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-4 sm:p-6">
          <ShoppingCart size={36} className="mb-2 sm:mb-3 opacity-20 sm:w-12 sm:h-12" />
          <p className="text-xs sm:text-sm font-semibold text-slate-500">No items</p>
        </div>
      ) : (
        <>
          {/* Scrollable Receipt Items */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3">
            <div className="space-y-1.5 sm:space-y-2">
              {items.map((item, index) => {
                const discount = item.discount ?? 0;
                const discountedPrice = item.price * (1 - discount / 100);
                return (
                  <div
                    key={item.id}
                    className="border-b border-dashed border-slate-300 pb-1.5 sm:pb-2 last:border-0"
                  >
                    {/* Item Name Row */}
                    <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <div className="flex-1 flex items-center gap-1 sm:gap-1.5">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-600">{index + 1}.</span>
                        <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight">
                          {item.name}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded flex-shrink-0"
                        disabled={loading}
                        title="Remove"
                      >
                        <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                    </div>
                    {/* Bill Line: Qty × Price × Discount = Total */}
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
                            {formatCurrency(Number(item.price))}
                          </button>
                        )}
                        <span className="text-slate-500">×</span>
                        {/* Discount (editable, with controls) */}
                        <div className="flex items-center gap-0.5 ml-2">
                          <button
                            onClick={() => {
                              if (onUpdatePrice) {
                                const newDiscount = Math.max(0, Math.min(100, discount - 1));
                                onUpdatePrice(item.id, item.price);
                              }
                            }}
                            className="w-4 h-4 bg-slate-200 hover:bg-blue-500 hover:text-white text-slate-600 rounded flex items-center justify-center text-xs font-bold"
                            disabled={loading || discount <= 0}
                            tabIndex={-1}
                          >
                            −
                          </button>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0 && val <= 100) {
                                if (onUpdatePrice) {
                                  onUpdatePrice(item.id, item.price);
                                }
                              }
                            }}
                            className="w-12 h-5 text-xs bg-white text-slate-900 border border-blue-500 rounded px-1"
                            tabIndex={5}
                          />
                          <button
                            onClick={() => {
                              if (onUpdatePrice) {
                                const newDiscount = Math.max(0, Math.min(100, discount + 1));
                                onUpdatePrice(item.id, item.price);
                              }
                            }}
                            className="w-4 h-4 bg-slate-200 hover:bg-blue-500 hover:text-white text-slate-600 rounded flex items-center justify-center text-xs font-bold"
                            disabled={loading || discount >= 100}
                            tabIndex={-1}
                          >
                            +
                          </button>
                          <span className="text-slate-500">% off</span>
                        </div>
                      </div>
                      {/* Line Total (discounted) */}
                      <span className="font-mono font-bold text-slate-800">
                        {formatCurrency(discountedPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </>
      )}

      {/* Checkout Payment Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md w-[95vw] max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-center">
              Checkout Payment
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
              Total: <span className="font-bold text-blue-600">Rs. {formatCurrency(total)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
            {/* Customer Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="customerName" className="text-sm sm:text-base font-medium">Customer Name <span className="text-gray-500 text-xs sm:text-sm">(Optional - defaults to Walk-in)</span></Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    document.getElementById('amountPaid')?.focus()
                  }
                }}
                placeholder="Enter customer name (optional)"
                className="h-10 sm:h-12 text-sm sm:text-base md:text-lg"
                autoFocus
              />
            </div>

            {/* Amount Paid or Customer Return Balance */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={enableReturnBalance ? 'customerReturnBalance' : 'amountPaid'} className="text-sm sm:text-base font-medium">
                  {enableReturnBalance ? 'Customer Return Balance' : 'Amount Paid'}
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant={enableReturnBalance ? 'default' : 'outline'}
                  onClick={() => setEnableReturnBalance((v) => !v)}
                  className="ml-2 px-2 py-1 text-xs"
                >
                  {enableReturnBalance ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <Input
                id={enableReturnBalance ? 'customerReturnBalance' : 'amountPaid'}
                type="number"
                step="0.01"
                value={enableReturnBalance ? customerReturnBalance : amountPaid}
                onChange={(e) => enableReturnBalance ? setCustomerReturnBalance(e.target.value) : setAmountPaid(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleConfirmCheckout()
                  }
                }}
                placeholder="0.00"
                className="h-10 sm:h-12 text-sm sm:text-base md:text-lg"
                disabled={!enableReturnBalance && enableReturnBalance !== undefined && enableReturnBalance !== null && enableReturnBalance}
                readOnly={enableReturnBalance ? false : false}
              />
            </div>

            {/* Amount Due */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-base font-medium">
                {(enableReturnBalance ? customerReturnBalance : amountPaid) && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) > 0
                  ? parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) >= total
                    ? '\u2713 Change to Return'
                    : '\u26a0 Payment Shortage'
                  : 'Amount Due (Change)'}
              </Label>
              <Input
                value={
                  (enableReturnBalance ? customerReturnBalance : amountPaid) && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) > 0
                    ? `Rs. ${formatCurrency(Math.abs(parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) - total))}`
                    : 'Rs. 0.00'
                }
                readOnly
                className={`h-12 text-lg font-bold ${
                  (enableReturnBalance ? customerReturnBalance : amountPaid) && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) >= total
                    ? 'bg-green-100 text-green-700 border-green-500'
                    : (enableReturnBalance ? customerReturnBalance : amountPaid) && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) > 0
                    ? 'bg-red-100 text-red-700 border-red-500'
                    : 'bg-gray-100 text-gray-700'
                }`}
              />
              {(enableReturnBalance ? customerReturnBalance : amountPaid) && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) > 0 && parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid) < total && (
                <p className="text-sm text-red-600 font-medium">
                  Short by Rs. {formatCurrency(total - parseFloat(enableReturnBalance ? customerReturnBalance : amountPaid))}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCheckoutDialog(false)}
              className="h-12 text-base"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmCheckout}
              disabled={
                (enableReturnBalance
                  ? !customerReturnBalance || parseFloat(customerReturnBalance) <= 0
                  : !amountPaid || parseFloat(amountPaid) <= 0)
              }
              className={`h-12 text-base ${
                (enableReturnBalance
                  ? parseFloat(customerReturnBalance) >= total
                  : parseFloat(amountPaid) >= total)
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {(enableReturnBalance
                ? parseFloat(customerReturnBalance) >= total
                : parseFloat(amountPaid) >= total)
                ? '\u2713 Confirm Payment'
                : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
