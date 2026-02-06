'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { POSProducts } from '@/components/pos-products'
import { POSCart } from '@/components/pos-cart'
import { AppHeader } from '@/components/app-header'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

export default function POSPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('[v0] Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return prevCart
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id)
      return
    }
    const product = products.find((p) => p.id === id)
    if (product && quantity <= product.stock) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleUpdatePrice = (id: number, price: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, price } : item
      )
    )
  }

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const handleCheckout = async (customerName: string) => {
    if (cart.length === 0) return

    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          items: cart,
        }),
      })

      if (!res.ok) throw new Error('Checkout failed')

      const data = await res.json()
      
      // Store receipt data in session storage
      sessionStorage.setItem(`receipt_${data.billNo}`, JSON.stringify(data))
      
      // Redirect to receipt page
      router.push(`/receipt/${data.billNo}`)
      
      // Reset cart
      setCart([])
      
      // Refresh products to update stock
      fetchProducts()
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F9 for checkout - works from anywhere
      if (e.key === 'F9' && cart.length > 0) {
        e.preventDefault()
        const customerName = prompt('Enter customer name:')
        if (customerName !== null) {
          handleCheckout(customerName || 'Walk-in')
        }
        return
      }

      // ESC to clear cart
      if (e.key === 'Escape' && cart.length > 0) {
        e.preventDefault()
        if (confirm('Clear all items from cart?')) {
          setCart([])
        }
        return
      }

      // Prevent other shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl+Q for POS (home)
      if (e.ctrlKey && e.key === 'q') {
        e.preventDefault()
        router.push('/pos')
      }
      // Ctrl+U for admin
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        router.push('/admin/users')
      }
      // Ctrl+N for inventory
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        router.push('/inventory')
      }
      // Ctrl+B for history
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        router.push('/history')
      }
      // Ctrl+X for logout
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault()
        router.push('/auth')
      }
      // Ctrl+/ for help
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        setShowHelpDialog(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router, cart])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading POS...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <AppHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Side - Product Selection */}
        <div className="flex-1 bg-white shadow-sm order-2 lg:order-1 overflow-auto">
          <POSProducts
            products={products}
            onAddToCart={handleAddToCart}
            loading={checkoutLoading}
          />
        </div>
        
        {/* Right Side - Receipt Style Cart (Compact) */}
        <div className="w-full lg:w-[350px] bg-white shadow-2xl order-1 lg:order-2 flex flex-col">
          <POSCart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
          />
        </div>
      </div>
    </main>
  )
}
