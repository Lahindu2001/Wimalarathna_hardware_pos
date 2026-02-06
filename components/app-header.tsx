'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, HelpCircle, Users, Package, BarChart3, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { KeyboardHelp } from '@/components/keyboard-help'

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState('')

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Alt+1 for POS
      if (e.altKey && e.key === '1') {
        e.preventDefault()
        router.push('/pos')
      }
      // Alt+2 for Admin
      if (e.altKey && e.key === '2') {
        e.preventDefault()
        router.push('/admin/users')
      }
      // Alt+3 for Inventory
      if (e.altKey && e.key === '3') {
        e.preventDefault()
        router.push('/inventory')
      }
      // Alt+4 for History
      if (e.altKey && e.key === '4') {
        e.preventDefault()
        router.push('/history')
      }
      // Alt+5 for Logout
      if (e.altKey && e.key === '5') {
        e.preventDefault()
        setShowLogoutDialog(true)
      }
      // Alt+H for Help
      if (e.altKey && e.key === 'h') {
        e.preventDefault()
        setShowHelpDialog(true)
      }
    }

    window.addEventListener('keydown', handleGlobalKeys)
    return () => window.removeEventListener('keydown', handleGlobalKeys)
  }, [router])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }
      setCurrentDateTime(now.toLocaleString('en-US', options))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

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
              <p className="text-xs md:text-sm text-blue-200 font-medium mt-1">
                {currentDateTime}
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
                <Home size={18} />
                <span className="hidden md:inline">Home</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Alt+1
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowHelpDialog(true)}
                className="gap-2 text-white hover:bg-white/20"
                size="sm"
              >
                <HelpCircle size={18} />
                <span className="hidden md:inline">Help</span>
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Alt+H
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
                <span className="hidden lg:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono">
                  Alt+2
                </span>
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
                  Alt+3
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
                  Alt+4
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
                  Alt+5
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

      {/* Help Dialog - Global */}
      <KeyboardHelp open={showHelpDialog} onOpenChange={setShowHelpDialog} />
    </>
  )
}
