'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search, ShoppingCart, Hash } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface POSProductsProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  loading?: boolean
}

export function POSProducts({
  products,
  onAddToCart,
  loading = false,
}: POSProductsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus search on Space bar (when not typing in an input)
      if (e.code === 'Space' && e.target === document.body) {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Try to add by ID first (if it's a number)
    const id = parseInt(searchQuery)
    if (!isNaN(id)) {
      const product = products.find(p => p.id === id)
      if (product && product.stock > 0) {
        onAddToCart(product)
        setSearchQuery('')
        return
      }
    }
    
    // If only one product matches the search, add it
    if (filteredProducts.length === 1 && filteredProducts[0].stock > 0) {
      onAddToCart(filteredProducts[0])
      setSearchQuery('')
    }
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <Input
            ref={searchRef}
            type="text"
            placeholder="Search by Product ID or Name... (Press Space or Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base text-gray-900 placeholder:text-gray-400 bg-white border-2 border-gray-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            tabIndex={1}
            autoFocus
          />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-3 flex items-center justify-center text-gray-800 py-16">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0 || loading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  product.stock === 0
                    ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md active:scale-95'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                      #{product.id}
                    </span>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${
                        product.stock === 0 ? 'text-red-600' : 
                        product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      Rs. {Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
