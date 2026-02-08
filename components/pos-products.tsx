'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stock: number
  discount?: number // Discount percentage (0-100)
}

interface POSProductsProps {
  products: Product[]
  onAddToCart: (product: Product, quantity?: number, customPrice?: number) => void
  loading?: boolean
}

export function POSProducts({
  products,
  onAddToCart,
  loading = false,
}: POSProductsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<string>('1')
  const [customPrice, setCustomPrice] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  const [discount, setDiscount] = useState<string>('0')
  
  const searchRef = useRef<HTMLInputElement>(null)
  const qtyRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const discountRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

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

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      ),
    [products, searchQuery]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowResults(true)
    setHighlightedIndex(-1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || filteredProducts.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => 
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < filteredProducts.length) {
        selectProduct(filteredProducts[highlightedIndex])
      } else if (filteredProducts.length === 1) {
        selectProduct(filteredProducts[0])
      }
    } else if (e.key === 'Escape') {
      setShowResults(false)
      setHighlightedIndex(-1)
    }
  }

  const selectProduct = (product: Product) => {
    if (product.stock === 0) return
    
    setSelectedProduct(product)
    setCustomPrice(product.price.toString())
    setQuantity('1')
    setDiscount('0')
    setShowResults(false)
    setSearchQuery('')
    setTimeout(() => {
      qtyRef.current?.focus()
      qtyRef.current?.select()
    }, 50)
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      const qty = parseInt(quantity) || 1
      const price = parseFloat(customPrice) || selectedProduct.price
      const disc = parseFloat(discount) || 0
      if (qty > 0 && price > 0 && qty <= selectedProduct.stock && disc >= 0 && disc <= 100) {
        const productWithCustomPrice = { ...selectedProduct, price, discount: disc }
        for (let i = 0; i < qty; i++) {
          onAddToCart(productWithCustomPrice)
        }
        setSelectedProduct(null)
        setQuantity('1')
        setCustomPrice('')
        setDiscount('0')
        searchRef.current?.focus()
      }
    }
  }

  const handleKeyDownOnPrice = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      discountRef.current?.focus()
      discountRef.current?.select()
    }
    // Shift + Up Arrow to go back to quantity
    if (e.shiftKey && e.key === 'ArrowUp') {
      e.preventDefault()
      qtyRef.current?.focus()
      qtyRef.current?.select()
    }
  }

  const handleKeyDownOnDiscount = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleAddToCart()
    }
    // Shift + Up Arrow to go back to price
    if (e.shiftKey && e.key === 'ArrowUp') {
      e.preventDefault()
      priceRef.current?.focus()
      priceRef.current?.select()
    }
  }

  const handleKeyDownOnQty = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      priceRef.current?.focus()
      priceRef.current?.select()
    }
    // Shift + Down Arrow to go to price
    if (e.shiftKey && e.key === 'ArrowDown') {
      e.preventDefault()
      priceRef.current?.focus()
      priceRef.current?.select()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-blue-800">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Add Products</h2>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">Search and select items to add to cart</p>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
        {/* Search Input with Dropdown Results */}
        <div className="relative">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 text-slate-400 z-10" size={18} />
            <Input
              ref={searchRef}
              type="text"
              placeholder="Type product ID or name... (Use ↑↓ arrow keys)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery && setShowResults(true)}
              className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 shadow-sm"
              tabIndex={1}
              autoFocus
            />
          </div>
          
          {/* Dropdown Results */}
          {showResults && searchQuery && (
            <div 
              ref={resultsRef}
              className="absolute z-20 w-full mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto"
            >
              {filteredProducts.length === 0 ? (
                <div className="px-3 sm:px-5 py-3 sm:py-4 text-slate-500 text-xs sm:text-sm text-center">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className={`px-3 sm:px-5 py-3 sm:py-4 cursor-pointer border-b border-slate-100 transition-all ${
                      product.stock === 0 
                        ? 'bg-slate-50 opacity-50 cursor-not-allowed' 
                        : highlightedIndex === index
                        ? 'bg-blue-50 border-l-4 border-l-blue-600 shadow-sm'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <span className="bg-blue-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold">
                            #{product.id}
                          </span>
                          <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' : 
                            product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} available`}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                          {product.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                          Rs. {Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Product Info */}
        {selectedProduct && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-3 sm:p-4 md:p-5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                  <span className="bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold">
                    #{selectedProduct.id}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                    selectedProduct.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedProduct.stock} in stock
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                title="Clear selection"
              >
                <span className="text-lg sm:text-xl font-bold">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Quantity and Price Inputs */}
        {selectedProduct && (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Quantity
              </label>
              <Input
                ref={qtyRef}
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={handleKeyDownOnQty}
                onFocus={(e) => e.target.select()}
                className="h-12 sm:h-14 text-base sm:text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 shadow-sm"
                tabIndex={2}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Price (Rs.) <span className="text-xs text-blue-600">(Editable)</span>
              </label>
              <Input
                ref={priceRef}
                type="number"
                step="0.01"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                onKeyDown={handleKeyDownOnPrice}
                className="h-12 sm:h-14 text-base sm:text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 shadow-sm"
                tabIndex={3}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Discount (%) <span className="text-xs text-blue-600">(0-100)</span>
              </label>
              <Input
                ref={discountRef}
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                onKeyDown={handleKeyDownOnDiscount}
                className="h-12 sm:h-14 text-base sm:text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 shadow-sm"
                tabIndex={4}
              />
            </div>

            {/* Show discounted price summary */}
            <div className="mt-2 mb-4 text-sm sm:text-base font-semibold text-blue-700">
              Discounted Price: Rs. {(() => {
                const price = parseFloat(customPrice) || selectedProduct.price;
                const disc = parseFloat(discount) || 0;
                return (price * (1 - disc / 100)).toFixed(2);
              })()}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedProduct || loading || parseInt(quantity) <= 0 || parseInt(quantity) > selectedProduct.stock || parseFloat(discount) < 0 || parseFloat(discount) > 100}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              tabIndex={5}
            >
              <Plus size={18} className="mr-1.5 sm:mr-2 sm:w-[22px] sm:h-[22px]" />
              Add to Cart
            </Button>
          </>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-slate-200">
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-[10px] sm:text-xs text-slate-600">
              <p><kbd className="px-1.5 sm:px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] sm:text-xs font-mono">F9</kbd> Checkout</p>
              <p><kbd className="px-1.5 sm:px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] sm:text-xs font-mono">Esc</kbd> Clear cart</p>
              <p><kbd className="px-1.5 sm:px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] sm:text-xs font-mono">Tab</kbd> Next field</p>
              <p><kbd className="px-1.5 sm:px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] sm:text-xs font-mono">Shift+↑↓</kbd> Qty/Price</p>
              <p><kbd className="px-1.5 sm:px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] sm:text-xs font-mono">↑↓</kbd> Navigate results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
