'use client'

import { useState, useEffect, useRef } from 'react'
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
  // Refs for auto-scroll
  const addProductSectionRef = useRef<HTMLDivElement>(null);
  const productListSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  // New product form state
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductQuantity, setNewProductQuantity] = useState('')
  const [addProductLoading, setAddProductLoading] = useState(false)
  const [newProductDiscount, setNewProductDiscount] = useState('0')
  const [lastDiscount, setLastDiscount] = useState('0')
  // Scroll to section when input is focused
  const handleAddProductFocus = () => {
    addProductSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleProductListFocus = () => {
    productListSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  // Add new product to DB and cart
  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductQuantity) {
      alert('Name, price, and quantity are required');
      return;
    }
    const discount = parseFloat(newProductDiscount) || 0;
    if (discount < 0 || discount > 100) {
      alert('Discount must be between 0 and 100');
      return;
    }
    const quantity = parseFloat(newProductQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a positive number (decimals allowed)');
      return;
    }
    setAddProductLoading(true);
    try {
      const price = parseFloat(newProductPrice);
      const discountablePrice = price * (1 - discount / 100);
      if (newProductName.trim().toLowerCase() === 'other') {
        // Add to cart only, not to product table
        setCart((prevCart) => {
          // Find if 'other' already exists in cart
          const existing = prevCart.find(item => item.name.trim().toLowerCase() === 'other');
          if (existing) {
            return prevCart.map(item =>
              item.name.trim().toLowerCase() === 'other'
                ? { ...item, quantity: item.quantity + quantity, price, discount, discountablePrice }
                : item
            );
          }
          // Add new 'other' item with dummy id
          return [...prevCart, {
            id: -1, // dummy id for 'other'
            name: 'other',
            price,
            stock: 9999,
            quantity,
            discount,
            discountablePrice
          }];
        });
        // Reset form
        setNewProductName('');
        setNewProductPrice('');
        setNewProductQuantity('');
        setNewProductDiscount('0');
        setLastDiscount(newProductDiscount);
        return;
      }
      // For all other products, add to DB and cart
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProductName, price, stock: 9999 }),
      });
      if (!res.ok) throw new Error('Failed to add product');
      const product = await res.json();
      setProducts((prev) => [...prev, product]);
      setCart((prevCart) => {
        const existing = prevCart.find(item => item.id === product.id);
        if (existing) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity, discount, discountablePrice }
              : item
          );
        }
        return [...prevCart, { ...product, quantity, discount, discountablePrice }];
      });
      setNewProductName('');
      setNewProductPrice('');
      setNewProductQuantity('');
      setNewProductDiscount('0');
      setLastDiscount(newProductDiscount);
    } catch (error) {
      alert('Failed to add product');
    } finally {
      setAddProductLoading(false);
    }
  };

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

  // Accepts quantity and customPrice from POSProducts
  const handleAddToCart = (product: Product, quantity: number = 1, customPrice?: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      const qty = isNaN(quantity) || quantity <= 0 ? 1 : quantity
      if (existingItem) {
        // If you want to sum quantities, use:
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: parseFloat((item.quantity + qty).toFixed(2)), price: customPrice ?? item.price }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: qty, price: customPrice ?? product.price }]
    })
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id)
      return
    }
    const qty = parseFloat(String(quantity))
    if (isNaN(qty) || qty <= 0) {
      handleRemoveFromCart(id)
      return
    }
    const product = products.find((p) => p.id === id)
    if (product && qty <= product.stock) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
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

  // New: Update discount for a cart item
  const handleUpdateDiscount = (id: number, discount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, discount } : item
      )
    );
  }

  const handleCheckout = async (
    customerName: string,
    amountPaid: number,
    changeReturned: number,
    customerReturnBalance?: number,
    enableReturnBalance?: boolean
  ) => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);
    try {
      // Map cart items: for 'other' product, remove id or set id to null
      const checkoutItems = cart.map(item => {
        if (item.name.trim().toLowerCase() === 'other') {
          // Remove id or set id to null for 'other'
          const { id, ...rest } = item;
          return { ...rest, id: null };
        }
        return item;
      });
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          items: checkoutItems,
          amountPaid,
          changeReturned,
          customerReturnBalance: enableReturnBalance ? customerReturnBalance : undefined,
          enableReturnBalance,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');

      const data = await res.json();
      // Store receipt data in session storage
      sessionStorage.setItem(`receipt_${data.billNo}`, JSON.stringify(data));
      // Redirect to receipt page
      router.push(`/receipt/${data.billNo}`);
      // Reset cart
      setCart([]);
      // Refresh products to update stock
      fetchProducts();
    } catch (error) {
      console.error('[v0] Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart, checkoutLoading])

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

      {/* Top: Temporary Cart */}
      <div className="w-full max-w-4xl xl:max-w-5xl mx-auto mt-1 mb-1 px-2">
        <div className="bg-white shadow-2xl rounded flex flex-col">
          <POSCart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onUpdateDiscount={handleUpdateDiscount}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
          />
        </div>
      </div>

      {/* Main POS Columns: Add Product (2/5) | Product List (3/5) */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 px-2 mt-2">
        {/* Left: Add Product Form (2/5) */}
        <section className="md:w-2/5 w-full flex flex-col justify-start">
          <div ref={addProductSectionRef} className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-4">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">Add New Product (Not in Search List)</h2>
            <form onSubmit={handleAddNewProduct} className="flex flex-col gap-3">
              <label className="text-xs font-medium mb-0.5">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={newProductName}
                onChange={e => setNewProductName(e.target.value)}
                className="border p-2 rounded text-sm mb-1"
                required
                onFocus={handleAddProductFocus}
              />
              <label className="text-xs font-medium mb-0.5">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={newProductPrice}
                onChange={e => setNewProductPrice(e.target.value)}
                className="border p-2 rounded text-sm mb-1"
                required
                min="0"
                step="0.01"
                onFocus={handleAddProductFocus}
              />
              <label className="text-xs font-medium mb-0.5">Discount (%)</label>
              <input
                type="number"
                placeholder="Discount (%)"
                value={newProductDiscount}
                onChange={e => setNewProductDiscount(e.target.value)}
                className="border p-2 rounded text-sm mb-1"
                min="0"
                max="100"
                onFocus={handleAddProductFocus}
              />
              <label className="text-xs font-medium mb-0.5">Quantity (for cart)</label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="0.01"
                placeholder="Quantity"
                value={newProductQuantity}
                onChange={e => setNewProductQuantity(e.target.value)}
                className="border p-2 rounded text-sm mb-1"
                required
                onFocus={handleAddProductFocus}
              />
              {newProductPrice && (
                <>
                  <div className="text-xs text-gray-700 mb-1">
                    Discountable Price: Rs. {(
                      parseFloat(newProductPrice) * (1 - (parseFloat(newProductDiscount) || 0) / 100)
                    ).toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-700 mb-1 font-semibold">
                    {parseFloat(newProductQuantity) > 0 && !isNaN(parseFloat(newProductQuantity))
                      ? `${parseFloat(newProductQuantity)} × Rs. ${(
                          parseFloat(newProductPrice) * (1 - (parseFloat(newProductDiscount) || 0) / 100)
                        ).toFixed(2)} = Rs. ${(
                          parseFloat(newProductQuantity) * parseFloat(newProductPrice) * (1 - (parseFloat(newProductDiscount) || 0) / 100)
                        ).toFixed(2)}`
                      : ''}
                  </div>
                </>
              )}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-1 text-sm font-medium disabled:opacity-50 transition-colors"
                disabled={addProductLoading}
              >
                {addProductLoading ? 'Adding...' : 'Add Product & Cart'}
              </button>
            </form>
          </div>
        </section>
        {/* Right: Search and Product List (3/5) */}
        <section className="md:w-3/5 w-full flex flex-col">
          <div ref={productListSectionRef} className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-4 flex-1 min-h-[400px]">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">Search and Select Products to Add to Cart</h2>
            {/* If you have a search input, add onFocus={handleProductListFocus} to it. If not, you can add this to the first input in POSProducts. */}
            <POSProducts
              products={products}
              onAddToCart={handleAddToCart}
              loading={checkoutLoading}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
