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
  
  const searchRef = useRef<HTMLInputElement>(null)
  const qtyRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
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
    setShowResults(false)
    setSearchQuery('')
    setTimeout(() => qtyRef.current?.focus(), 50)
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      const qty = parseInt(quantity) || 1
      const price = parseFloat(customPrice) || selectedProduct.price
      
      if (qty > 0 && price > 0 && qty <= selectedProduct.stock) {
        const productWithCustomPrice = { ...selectedProduct, price }
        
        for (let i = 0; i < qty; i++) {
          onAddToCart(productWithCustomPrice)
        }
        
        setSelectedProduct(null)
        setQuantity('1')
        setCustomPrice('')
        
        searchRef.current?.focus()
      }
    }
  }

  const handleKeyDownOnPrice = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleAddToCart()
    }
  }

  const handleKeyDownOnQty = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      priceRef.current?.focus()
      priceRef.current?.select()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800">
        <h2 className="text-xl font-bold text-white">Add Products</h2>
        <p className="text-blue-100 text-sm mt-1">Search and select items to add to cart</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Search Input with Dropdown Results */}
        <div className="relative">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400 z-10" size={20} />
            <Input
              ref={searchRef}
              type="text"
              placeholder="Type product ID or name... (Use ↑↓ arrow keys)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery && setShowResults(true)}
              className="pl-12 h-14 text-base text-slate-900 placeholder:text-slate-400 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
              tabIndex={1}
              autoFocus
            />
          </div>
          
          {/* Dropdown Results */}
          {showResults && searchQuery && (
            <div 
              ref={resultsRef}
              className="absolute z-20 w-full mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
            >
              {filteredProducts.length === 0 ? (
                <div className="px-5 py-4 text-slate-500 text-sm text-center">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className={`px-5 py-4 cursor-pointer border-b border-slate-100 transition-all ${
                      product.stock === 0 
                        ? 'bg-slate-50 opacity-50 cursor-not-allowed' 
                        : highlightedIndex === index
                        ? 'bg-blue-50 border-l-4 border-l-blue-600 shadow-sm'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-bold">
                            #{product.id}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' : 
                            product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} available`}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {product.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-blue-600">
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
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold">
                    #{selectedProduct.id}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedProduct.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedProduct.stock} in stock
                  </span>
                </div>
                <p className="text-base font-bold text-slate-800">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-2 transition-colors"
                title="Clear selection"
              >
                <span className="text-xl font-bold">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Quantity and Price Inputs */}
        {selectedProduct && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="h-14 text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
                tabIndex={2}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="h-14 text-lg font-semibold text-slate-900 bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm"
                tabIndex={3}
              />
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedProduct || loading || parseInt(quantity) <= 0 || parseInt(quantity) > selectedProduct.stock}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              tabIndex={4}
            >
              <Plus size={22} className="mr-2" />
              Add to Cart
            </Button>
          </>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <p><kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">F9</kbd> Checkout</p>
              <p><kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Tab</kbd> Next field</p>
              <p><kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">↑↓</kbd> Navigate results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
