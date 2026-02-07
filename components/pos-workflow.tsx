'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Search, ShoppingBag, X } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
}

interface POSWorkflowProps {
  products: Product[]
  onCheckout: (items: CartItem[], customerName: string) => void
  loading?: boolean
}

export function POSWorkflow({ products, onCheckout, loading = false }: POSWorkflowProps) {
  // Format number with commas
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  
  const searchRef = useRef<HTMLInputElement>(null)
  const qtyRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const checkoutRef = useRef<HTMLButtonElement>(null)

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      ).slice(0, 10) // Limit to 10 results
      setFilteredProducts(filtered)
      setHighlightedIndex(0) // Reset highlighted index when results change
    } else {
      setFilteredProducts([])
      setShowDropdown(false)
      setHighlightedIndex(0)
    }
  }, [searchQuery, products])

  const selectProduct = (product: Product) => {
    setSelectedProduct(product)
    setSearchQuery(product.name)
    setPrice(product.price.toString())
    setQuantity('1') // Set default quantity to 1
    setShowDropdown(false)
    // Focus quantity input
    setTimeout(() => qtyRef.current?.focus(), 100)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (showDropdown && filteredProducts.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % filteredProducts.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showDropdown && filteredProducts.length > 0) {
        setHighlightedIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setShowDropdown(false)
      setHighlightedIndex(0)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredProducts.length > 0) {
        selectProduct(filteredProducts[highlightedIndex])
      }
    } else if (e.key === 'Tab' && selectedProduct) {
      // Allow tab to qty field
      e.preventDefault()
      qtyRef.current?.focus()
    }
  }

  const handleQtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      priceRef.current?.focus()
    }
  }

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      checkoutRef.current?.focus()
    }
  }

  const handleCheckoutKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToCart()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // After checkout, go back to search
      resetForm()
      searchRef.current?.focus()
    }
  }

  const addToCart = () => {
    if (!selectedProduct) return
    
    const qty = parseInt(quantity) || 1
    const finalPrice = parseFloat(price) || selectedProduct.price

    // Validate quantity (must be at least 1, not 0)
    if (qty < 1 || quantity === '0' || quantity === '') {
      alert('Quantity must be at least 1')
      qtyRef.current?.focus()
      return
    }

    if (qty > selectedProduct.stock) {
      alert(`Only ${selectedProduct.stock} items available in stock`)
      qtyRef.current?.focus()
      return
    }

    // Validate price (must be greater than 0, not negative)
    if (finalPrice <= 0 || price === '0') {
      alert('Price must be greater than 0')
      priceRef.current?.focus()
      return
    }

    const existingItem = cart.find(item => item.id === selectedProduct.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + qty, price: finalPrice }
          : item
      ))
    } else {
      setCart([...cart, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: finalPrice,
        quantity: qty,
        stock: selectedProduct.stock
      }])
    }

    resetForm()
    searchRef.current?.focus()
  }

  const resetForm = () => {
    setSearchQuery('')
    setSelectedProduct(null)
    setQuantity('')
    setPrice('')
    setFilteredProducts([])
    setShowDropdown(false)
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const handleOpenCheckout = useCallback(() => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }
    setShowCheckoutDialog(true)
    setCustomerName('')
    setAmountPaid('')
  }, [cart])

  const handleConfirmCheckout = () => {
    const paid = parseFloat(amountPaid)
    if (isNaN(paid) || paid <= 0 || !amountPaid) {
      alert('Please enter amount paid')
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
    
    onCheckout(cart, customerName || 'Walk-in')
    setCart([])
    setShowCheckoutDialog(false)
    setCustomerName('')
    setAmountPaid('')
  }

  // F9 keyboard shortcut for checkout
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9' && cart.length > 0) {
        e.preventDefault()
        handleOpenCheckout()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart, handleOpenCheckout])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
    <div className="h-full flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl">
        {/* Cart Summary Bar at Top */}
        {cart.length > 0 && (
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm opacity-90">Items</p>
                  <p className="text-2xl font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Products</p>
                  <p className="text-2xl font-bold">{cart.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total</p>
                <p className="text-3xl font-bold">Rs. {formatCurrency(total)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Input Section */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Point of Sale</h2>
        
        <div className="space-y-6">
          {/* Search Product - Full Width */}
          <div className="relative">
            <label className="block text-base font-semibold text-gray-700 mb-3">
              1. Search Product (Press Enter or Tab)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-4 text-gray-400" size={24} />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Type product name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  // Clear selected product when user starts typing again
                  if (selectedProduct) {
                    setSelectedProduct(null)
                    setQuantity('')
                    setPrice('')
                  }
                  // Show dropdown when typing
                  if (e.target.value.trim()) {
                    setShowDropdown(true)
                  }
                }}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  // Show dropdown if there's a query and filtered products
                  if (searchQuery && filteredProducts.length > 0) {
                    setShowDropdown(true)
                  }
                }}
                className="pl-12 h-16 text-xl bg-white border-2 border-gray-300 focus:border-blue-600"
                tabIndex={1}
                autoFocus
              />
              
              {/* Dropdown */}
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                  {filteredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => selectProduct(product)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 transition-colors ${
                        index === highlightedIndex
                          ? 'bg-blue-100 border-blue-300'
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`font-semibold ${
                            index === highlightedIndex ? 'text-blue-900' : 'text-gray-900'
                          }`}>{product.name}</p>
                          <p className="text-sm text-gray-600">ID: {product.id} | Rs. {Number(product.price || 0).toFixed(2)}</p>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded ${
                          index === highlightedIndex
                            ? 'text-blue-700 bg-blue-200'
                            : 'text-gray-500 bg-gray-100'
                        }`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quantity and Price - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quantity Input */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                2. Quantity (Press Tab)
                {selectedProduct && (
                  <span className="ml-2 text-gray-500 text-sm">
                    (Stock: {selectedProduct.stock})
                  </span>
                )}
              </label>
              <Input
                ref={qtyRef}
                type="text"
                inputMode="numeric"
                placeholder="Enter quantity..."
                value={quantity}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  // Remove leading zeros
                  value = value.replace(/^0+/, '')
                  // If just 0, convert to empty
                  if (value === '0') {
                    value = ''
                  }
                  setQuantity(value)
                }}
                onFocus={(e) => e.target.select()}
                onKeyDown={handleQtyKeyDown}
                disabled={!selectedProduct}
                className="h-14 text-lg bg-white border-2 border-gray-300 focus:border-blue-600 disabled:bg-gray-100"
                tabIndex={2}
              />
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                3. Price (Press Tab)
              </label>
              <Input
                ref={priceRef}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter price..."
                value={price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  // Only allow positive numbers
                  if (value > 0 || e.target.value === '') {
                    setPrice(e.target.value)
                  }
                }}
                onFocus={(e) => e.target.select()}
                onKeyDown={handlePriceKeyDown}
                disabled={!selectedProduct}
                className="h-14 text-lg bg-white border-2 border-gray-300 focus:border-blue-600 disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                tabIndex={3}
              />
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            ref={checkoutRef}
            onClick={addToCart}
            onKeyDown={handleCheckoutKeyDown}
            disabled={!selectedProduct || loading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-xl font-bold mt-2"
            tabIndex={4}
          >
            <ShoppingBag size={24} className="mr-2" />
            Add to Cart (Press Enter)
          </Button>

          {/* Checkout Button */}
          {cart.length > 0 && (
            <Button
              onClick={handleOpenCheckout}
              disabled={loading}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold"
            >
              {loading ? 'Processing...' : (
                <span className="flex items-center justify-center gap-3">
                  Checkout - Rs. {formatCurrency(total)}
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Press F9</span>
                </span>
              )}
            </Button>
          )}
        </div>
        </div>
      </div>
    </div>

      {/* Checkout Payment Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Checkout Payment
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-600 mt-2">
              Total: <span className="font-bold text-blue-600">Rs. {formatCurrency(total)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-base font-medium">Customer Name <span className="text-gray-500 text-sm">(Optional - defaults to Walk-in)</span></Label>
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
                className="h-12 text-lg"
                autoFocus
              />
            </div>

            {/* Amount Paid */}
            <div className="space-y-2">
              <Label htmlFor="amountPaid" className="text-base font-medium">Amount Paid</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleConfirmCheckout()
                  }
                }}
                placeholder="0.00"
                className="h-12 text-lg"
              />
            </div>

            {/* Amount Due */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {amountPaid && parseFloat(amountPaid) > 0
                  ? parseFloat(amountPaid) >= total
                    ? '✓ Change to Return'
                    : '⚠ Payment Shortage'
                  : 'Amount Due (Change)'}
              </Label>
              <Input
                value={
                  amountPaid && parseFloat(amountPaid) > 0
                    ? `Rs. ${formatCurrency(Math.abs(parseFloat(amountPaid) - total))}`
                    : 'Rs. 0.00'
                }
                readOnly
                className={`h-12 text-lg font-bold ${
                  amountPaid && parseFloat(amountPaid) >= total
                    ? 'bg-green-100 text-green-700 border-green-500'
                    : amountPaid && parseFloat(amountPaid) > 0
                    ? 'bg-red-100 text-red-700 border-red-500'
                    : 'bg-gray-100 text-gray-700'
                }`}
              />
              {amountPaid && parseFloat(amountPaid) > 0 && parseFloat(amountPaid) < total && (
                <p className="text-sm text-red-600 font-medium">
                  Short by Rs. {formatCurrency(total - parseFloat(amountPaid))}
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
              disabled={!amountPaid || parseFloat(amountPaid) <= 0}
              className={`h-12 text-base ${
                amountPaid && parseFloat(amountPaid) >= total
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {amountPaid && parseFloat(amountPaid) >= total
                ? '✓ Confirm Payment'
                : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
