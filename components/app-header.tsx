'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HelpCircle, Users, Package, BarChart3, LogOut } from 'lucide-react'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Company Info */}
            <div>
              <h1 className="text-lg md:text-xl font-bold">Wimalrathna Hardware</h1>
              <p className="text-xs md:text-sm text-blue-100">
                Hospital Opposite, Dompe | Phone: 0112409682
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/pos')}
                className={`gap-2 text-white hover:bg-white/20 ${
                  isActive('/pos') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <HelpCircle size={18} />
                <span className="hidden md:inline">Help</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Ctrl+?
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/admin/users')}
                className={`gap-2 text-white hover:bg-white/20 ${
                  isActive('/admin/users') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <Users size={18} />
                <span className="hidden md:inline">Admin</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/inventory')}
                className={`gap-2 text-white hover:bg-white/20 ${
                  isActive('/inventory') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <Package size={18} />
                <span className="hidden md:inline">Inventory</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Ctrl+I
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/history')}
                className={`gap-2 text-white hover:bg-white/20 ${
                  isActive('/history') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <BarChart3 size={18} />
                <span className="hidden md:inline">History</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Ctrl+H
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowLogoutDialog(true)}
                className="gap-2 text-white bg-red-600 hover:bg-red-700"
                size="sm"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Ctrl+L
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogTitle className="text-xl font-bold text-gray-900">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            Are you sure you want to logout? You will need to login again to access the system.
          </AlertDialogDescription>
          <div className="flex gap-3 mt-4">
            <AlertDialogCancel className="flex-1 border-2 border-gray-300 hover:bg-gray-100 text-gray-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
