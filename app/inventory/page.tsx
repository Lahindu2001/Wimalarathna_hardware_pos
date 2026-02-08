'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppHeader } from '@/components/app-header'
import { Plus, Edit2, Save, X, Package, Trash2, AlertTriangle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface CategoryCount {
  name: string
  count: number
  pattern: string
}

interface EditingProduct {
  name?: string
  price?: string | number
  stock?: string | number
}

export default function InventoryPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<EditingProduct>({})
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const stockRef = useRef<HTMLInputElement>(null)
  // const reorderLevelRef = useRef<HTMLInputElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Category definitions
  const categories: CategoryCount[] = [
    { name: 'Hammers', pattern: 'Hammer%', count: 0 },
    { name: 'Nails', pattern: 'Nails%', count: 0 },
    { name: 'Screws', pattern: '%Screw%', count: 0 },
    { name: 'Bolts', pattern: 'Bolt%', count: 0 },
    { name: 'Wrenches', pattern: 'Wrench%', count: 0 },
    { name: 'Pliers', pattern: 'Pliers%', count: 0 },
    { name: 'Saws', pattern: 'Saw%', count: 0 },
    { name: 'Screwdrivers', pattern: 'Screwdriver%', count: 0 },
    { name: 'Drill Bits', pattern: 'Drill Bit%', count: 0 },
    { name: 'Sandpaper', pattern: 'Sandpaper%', count: 0 },
    { name: 'Adhesives', pattern: '%Glue%', count: 0 },
    { name: 'Electrical', pattern: 'Wire Electrical%', count: 0 },
    { name: 'Plumbing', pattern: 'PVC Pipe%', count: 0 },
    { name: 'Cement', pattern: 'Cement%', count: 0 },
    { name: 'Wood', pattern: 'Wood%', count: 0 },
  ]

  // Calculate category counts based on products
  const categoryCounts = categories.map(cat => {
    const pattern = cat.pattern.replace(/%/g, '')
    const count = products.filter(p => {
      if (cat.pattern.startsWith('%') && cat.pattern.endsWith('%')) {
        return p.name.toLowerCase().includes(pattern.toLowerCase())
      } else if (cat.pattern.startsWith('%')) {
        return p.name.toLowerCase().endsWith(pattern.toLowerCase())
      } else if (cat.pattern.endsWith('%')) {
        return p.name.toLowerCase().startsWith(pattern.toLowerCase())
      }
      return p.name.toLowerCase() === pattern.toLowerCase()
    }).length
    return { ...cat, count }
  }).filter(cat => cat.count > 0)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Shift + Plus (+) to open Add Product dialog
      if (e.shiftKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        setShowAddDialog(true)
      }
      // Focus search on Ctrl+/ or Shift+/
      if ((e.ctrlKey && e.key === '/') || (e.shiftKey && e.key === '?')) {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Auto-focus product name when dialog opens
  useEffect(() => {
    if (showAddDialog) {
      setTimeout(() => {
        nameRef.current?.focus()
        nameRef.current?.select()
      }, 100)
    }
    
    // ESC key to close dialog
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddDialog) {
        setShowAddDialog(false)
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showAddDialog])

  // Auto-scroll to results when searching
  useEffect(() => {
    if (searchQuery && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [searchQuery])

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

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditValues({ ...product })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: editValues.name,
          price: parseFloat(editValues.price as any),
          stock: parseInt(editValues.stock as any),
        }),
      })

      if (!res.ok) throw new Error('Failed to update product')

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                id: editingId,
                name: editValues.name || p.name,
                price: parseFloat(editValues.price as any) || p.price,
                stock: parseInt(editValues.stock as any) || p.stock,
              }
            : p
        )
      )
      setEditingId(null)
      setEditValues({})
    } catch (error) {
      console.error('[v0] Failed to save product:', error)
      alert('Failed to save product')
    }
  }

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      })

      if (!res.ok) throw new Error('Failed to delete product')

      setProducts((prev) => prev.filter((p) => p.id !== productId))
      
      // Clear editing state if deleting the currently edited product
      if (editingId === productId) {
        setEditingId(null)
        setEditValues({})
      }
    } catch (error) {
      console.error('[v0] Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('All fields are required')
      return
    }

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: 9999,
        }),
      })

      if (!res.ok) throw new Error('Failed to add product')

      const product = await res.json()
      setProducts((prev) => [...prev, product])
      setNewProduct({ name: '', price: '' })
      setShowAddDialog(false)
    } catch (error) {
      console.error('[v0] Failed to add product:', error)
      alert('Failed to add product')
    }
  }

  const filteredProducts = products.filter((p) => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
    
    // Category filter
    if (!selectedCategory) return matchesSearch
    
    const category = categories.find(cat => cat.name === selectedCategory)
    if (!category) return matchesSearch
    
    const pattern = category.pattern.replace(/%/g, '')
    let matchesCategory = false
    
    if (category.pattern.startsWith('%') && category.pattern.endsWith('%')) {
      matchesCategory = p.name.toLowerCase().includes(pattern.toLowerCase())
    } else if (category.pattern.startsWith('%')) {
      matchesCategory = p.name.toLowerCase().endsWith(pattern.toLowerCase())
    } else if (category.pattern.endsWith('%')) {
      matchesCategory = p.name.toLowerCase().startsWith(pattern.toLowerCase())
    } else {
      matchesCategory = p.name.toLowerCase() === pattern.toLowerCase()
    }
    
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading inventory...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Add Product Button Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-3 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Plus size={18} />
              <span>Add Product</span>
              <span className="hidden lg:inline px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono">
                Shift++
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        {/* Low Stock Alert Card */}
        {/* Low Stock Alert Card removed (reorder level logic) */}

        {/* Category Cards */}
        {categoryCounts.length > 0 && (
          <Card className="p-4 md:p-6 bg-white shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Products by Category</h2>
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="gap-2"
                >
                  <X size={16} />
                  Clear Filter
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {categoryCounts.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className={`text-sm font-medium ${
                      selectedCategory === category.name ? 'text-white' : 'text-gray-600'
                    }`}>
                      {category.name}
                    </p>
                    <Package size={16} className={
                      selectedCategory === category.name ? 'text-white' : 'text-gray-400'
                    } />
                  </div>
                  <p className={`text-3xl font-bold ${
                    selectedCategory === category.name ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.count}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-3 md:p-6 bg-white shadow-md" ref={resultsRef}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search products... (Ctrl+/ or Shift+/)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>
            {selectedCategory && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  {selectedCategory}
                </span>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-gray-800">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="min-w-[640px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="text-gray-800 font-bold text-xs sm:text-sm">Product ID</TableHead>
                    <TableHead className="text-gray-800 font-bold text-xs sm:text-sm">Product Name</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold text-xs sm:text-sm">Price (Rs.)</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold text-xs sm:text-sm">Stock</TableHead>
                    {/* <TableHead className="text-right text-gray-800 font-bold text-xs sm:text-sm">Reorder Level</TableHead> */}
                    <TableHead className="text-center text-gray-800 font-bold text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-xs sm:text-sm text-gray-800 font-semibold">
                        {product.id}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {editingId === product.id ? (
                          <Input
                            value={editValues.name || ''}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                name: e.target.value,
                              })
                            }
                            className="border-2 border-blue-500 bg-white text-gray-900"
                          />
                        ) : (
                          product.name
                        )}
                      </TableCell>
                      <TableCell className="text-right text-gray-800">
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.price || ''}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                price: e.target.value,
                              })
                            }
                            className="w-24 text-right border-2 border-blue-500 bg-white text-gray-900"
                          />
                        ) : (
                          Number(product.price).toFixed(2)
                        )}
                      </TableCell>
                      <TableCell className="text-right text-gray-800">
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={editValues.stock || ''}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === '' || parseFloat(value) >= 0) {
                                setEditValues({
                                  ...editValues,
                                  stock: value,
                                })
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                e.preventDefault()
                              }
                            }}
                            className="w-24 text-right border-2 border-blue-500 bg-white text-gray-900"
                          />
                        ) : (
                          <span
                            className={
                              product.stock < 5
                                ? 'text-destructive font-bold'
                                : ''
                            }
                          >
                            {product.stock}
                          </span>
                        )}
                      </TableCell>
                      {/* Reorder Level column removed */}
                      <TableCell>
                        <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                          {editingId === product.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleSave}
                                className="gap-0.5 sm:gap-1 px-2 sm:px-3 h-8 sm:h-9"
                              >
                                <Save size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline text-xs sm:text-sm">Save</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(null)
                                  setEditValues({})
                                }}
                                className="gap-0.5 sm:gap-1 px-2 sm:px-3 h-8 sm:h-9"
                              >
                                <X size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline text-xs sm:text-sm">Cancel</span>
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(product)}
                                className="gap-0.5 sm:gap-1 px-2 sm:px-3 h-8 sm:h-9"
                              >
                                <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline text-xs sm:text-sm">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(product.id)}
                                className="gap-0.5 sm:gap-1 px-2 sm:px-3 h-8 sm:h-9"
                              >
                                <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline text-xs sm:text-sm">Delete</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Add New Product</DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Add a new product to the inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 font-semibold">Product Name</Label>
              <Input
                ref={nameRef}
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    priceRef.current?.focus()
                    priceRef.current?.select()
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    priceRef.current?.focus()
                    priceRef.current?.select()
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    nameRef.current?.focus()
                    nameRef.current?.select()
                  }
                }}
                placeholder="e.g., Hammer 500g"
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-900 font-semibold">Price (Rs.)</Label>
              <Input
                ref={priceRef}
                id="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addButtonRef.current?.focus()
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    nameRef.current?.focus()
                    nameRef.current?.select()
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    addButtonRef.current?.focus()
                  }
                }}
                placeholder="450.00"
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Stock input hidden, stock always defaults to 9999 */}

            {/* Reorder Level input removed */}

            <div className="flex gap-3 pt-4">
              <Button
                ref={cancelButtonRef}
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === 'ArrowUp') {
                    e.preventDefault()
                    addButtonRef.current?.focus()
                  }
                }}
                className="flex-1 h-11 border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-medium"
              >
                Cancel
              </Button>
              <Button
                ref={addButtonRef}
                onClick={handleAddProduct}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === 'ArrowUp') {
                    e.preventDefault()
                    // removed reorderLevelRef
                    // removed reorderLevelRef
                  }
                  if (e.shiftKey && e.key === 'ArrowDown') {
                    e.preventDefault()
                    cancelButtonRef.current?.focus()
                  }
                }}
                className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
