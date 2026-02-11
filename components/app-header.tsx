'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, HelpCircle, Users, Package, BarChart3, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { KeyboardHelp } from '@/components/keyboard-help'
import { useRef, useCallback } from 'react'

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
        <div
          className="px-1 py-1"
          style={{
            minWidth: 0,
            minHeight: 0,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="flex flex-row flex-wrap items-center justify-between gap-1"
            style={{
              rowGap: '0.25rem',
              columnGap: '0.5vw',
              width: '100%',
            }}
          >
            {/* Company Info */}
            <div className="min-w-0 flex-shrink text-left" style={{maxWidth: '60vw'}}>
              <h1
                className="font-bold truncate"
                style={{
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  lineHeight: 1.1,
                  marginBottom: 2,
                }}
              >
                Wimalarathna Hardware
              </h1>
              <p
                className="text-blue-100"
                style={{
                  fontSize: 'clamp(0.65rem, 1vw, 0.85rem)',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Hospital Opposite, Dompe | Phone: 0112409682
              </p>
              <p
                className="text-blue-200 font-medium mt-0.5"
                style={{
                  fontSize: 'clamp(0.65rem, 1vw, 0.85rem)',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {currentDateTime}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div
              className="flex flex-wrap items-center justify-end gap-1 sm:gap-2 flex-shrink-0"
              style={{rowGap: '0.15rem', columnGap: '0.3vw', flex: 1}}
            >
                    {/* Extra responsive tweaks for 1024x768 screens */}
                    <style>{`
                      @media (max-width: 1100px) and (min-width: 1024px) {
                        header .font-bold {
                          font-size: 1rem !important;
                        }
                        header p {
                          font-size: 0.8rem !important;
                        }
                        header .flex-wrap {
                          flex-wrap: wrap !important;
                        }
                        header .gap-1, header .gap-2 {
                          gap: 0.2rem !important;
                        }
                        header .px-2, header .px-4, header .md\:px-6 {
                          padding-left: 0.5rem !important;
                          padding-right: 0.5rem !important;
                        }
                      }
                    `}</style>
              <Button
                variant="ghost"
                onClick={() => router.push('/pos')}
                className={`gap-1 sm:gap-2 text-white hover:bg-white/20 px-2 sm:px-3 ${
                  isActive('/pos') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">Home <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+1</span></span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowHelpDialog(true)}
                className="gap-1 sm:gap-2 text-white hover:bg-white/20 px-2 sm:px-3"
                size="sm"
              >
                <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">Help <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+H</span></span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/admin/users')}
                className={`gap-1 sm:gap-2 text-white hover:bg-white/20 px-2 sm:px-3 ${
                  isActive('/admin/users') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">Admin <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+2</span></span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/inventory')}
                className={`gap-1 sm:gap-2 text-white hover:bg-white/20 px-2 sm:px-3 ${
                  isActive('/inventory') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">Inventory <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+3</span></span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/history')}
                className={`gap-1 sm:gap-2 text-white hover:bg-white/20 px-2 sm:px-3 ${
                  isActive('/history') ? 'bg-white/20' : ''
                }`}
                size="sm"
              >
                <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">History <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+4</span></span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowLogoutDialog(true)}
                className="gap-1 sm:gap-2 text-white bg-red-600 hover:bg-red-700 px-2 sm:px-3"
                size="sm"
              >
                <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden md:inline text-xs sm:text-sm">Logout <span className="inline xl:inline text-xs px-1.5 py-0.5 bg-white/20 rounded font-mono ml-1">Alt+5</span></span>
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
          <LogoutDialogActions handleLogout={handleLogout} setShowLogoutDialog={setShowLogoutDialog} />
        </AlertDialogContent>
      </AlertDialog>

      {/* Help Dialog - Global */}
      <KeyboardHelp open={showHelpDialog} onOpenChange={setShowHelpDialog} />
    </>
  )
}

// Custom actions for logout dialog with keyboard navigation
function LogoutDialogActions({ handleLogout, setShowLogoutDialog }: { handleLogout: () => void, setShowLogoutDialog: (v: boolean) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const logoutRef = useRef<HTMLButtonElement>(null)
  // Focus Logout by default
  useEffect(() => {
    logoutRef.current?.focus()
  }, [])
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === logoutRef.current) {
        cancelRef.current?.focus()
      } else {
        logoutRef.current?.focus()
      }
    }
    if (e.key === 'Escape') {
      setShowLogoutDialog(false)
    }
  }, [setShowLogoutDialog])
  return (
    <div className="flex gap-3 mt-4">
      <AlertDialogCancel
        ref={cancelRef}
        className="flex-1 border-2 border-gray-300 hover:bg-gray-100 text-gray-900"
        onKeyDown={handleKeyDown}
      >
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        ref={logoutRef}
        onClick={handleLogout}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        onKeyDown={handleKeyDown}
      >
        Logout
      </AlertDialogAction>
    </div>
  )
}
