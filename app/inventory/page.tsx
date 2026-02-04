'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Plus, Edit2, Save, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  id: number
  name: string
  price: number
  stock: number
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
  const searchRef = useRef<HTMLInputElement>(null)

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
      // Focus search on Ctrl+/
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
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
          stock: parseInt(newProduct.stock),
        }),
      })

      if (!res.ok) throw new Error('Failed to add product')

      const product = await res.json()
      setProducts((prev) => [...prev, product])
      setNewProduct({ name: '', price: '', stock: '' })
      setShowAddDialog(false)
    } catch (error) {
      console.error('[v0] Failed to add product:', error)
      alert('Failed to add product')
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
  )

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/pos')}
              className="gap-1 md:gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              size="sm"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Back to POS</span>
            </Button>
            <h1 className="text-lg md:text-2xl font-bold flex-1">
              Inventory Management
            </h1>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="gap-1 md:gap-2 bg-green-600 hover:bg-green-700 text-white border-0"
              size="sm"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Product</span>
              <span className="hidden lg:inline ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono">
                Shift++
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        <Card className="p-3 md:p-6 bg-white shadow-md">
          <div className="mb-6">
            <Input
              ref={searchRef}
              type="text"
              placeholder="Search products... (Ctrl+/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-800">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-300">
                    <TableHead className="text-gray-800 font-bold">Product ID</TableHead>
                    <TableHead className="text-gray-800 font-bold">Product Name</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold">Price (Rs.)</TableHead>
                    <TableHead className="text-right text-gray-800 font-bold">Stock</TableHead>
                    <TableHead className="text-center text-gray-800 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-gray-800 font-semibold">
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
                            value={editValues.stock || ''}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                stock: e.target.value,
                              })
                            }
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
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {editingId === product.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={handleSave}
                                className="gap-1"
                              >
                                <Save size={14} />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(null)
                                  setEditValues({})
                                }}
                                className="gap-1"
                              >
                                <X size={14} />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                              className="gap-1"
                            >
                              <Edit2 size={14} />
                              Edit
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="e.g., Hammer 500g"
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-900 font-semibold">Price (Rs.)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="450.00"
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-gray-900 font-semibold">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                placeholder="25"
                className="h-11 border-2 border-gray-300 focus:border-blue-600 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 h-11 border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
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
