'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { ShoppingCart } from 'lucide-react'

// Customer Service Top-Right Text
export const CustomerServiceBanner = () => (
  <div className="fixed top-4 right-6 z-50 text-right pointer-events-auto select-none">
    <div className="text-xs sm:text-lg text-gray-700 leading-tight">
      Having trouble?<br />
      Call OR Chat <br/>
      <span className="font-semibold text-blue-700">HelaCode </span><br />
      <span className="font-mono tracking-wider text-base sm:text-lg text-blue-800">074 2420 404</span>
      <div className="mt-1 flex justify-end gap-1">
        <a href="tel:0742420404" className="inline-flex items-center px-2 py-1 rounded bg-green-50 border border-green-200 text-green-800 text-xs font-medium hover:bg-green-100 transition" title="Call Now">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.06 16.06 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"/></svg>
          Call
        </a>
        <a href="https://wa.me/94742420404" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 rounded bg-green-50 border border-green-200 text-green-800 text-xs font-medium hover:bg-green-100 transition" title="WhatsApp Now">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.64 6.06L0 24l6.18-1.62A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22a9.93 9.93 0 01-5.13-1.42l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.65 1.13 2.83.14.18 1.95 2.98 4.74 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>
          WhatsApp
        </a>
      </div>
    </div>
  </div>
)

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Authentication failed')
        return
      }

      // If registration, show success message and switch to login
      if (!isLogin) {
        setSuccess(data.message || 'Registration successful! Waiting for admin approval.')
        setUsername('')
        setPassword('')
        setTimeout(() => {
          setIsLogin(true)
          setSuccess('')
        }, 3000)
        return
      }

      // Redirect to POS on successful login
      router.push('/pos')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CustomerServiceBanner />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-2 sm:p-4">
        <Card className="w-full max-w-sm min-w-0 p-4 sm:p-6 md:p-8 bg-white shadow-xl border-gray-200 flex flex-col gap-4">
          <div className="text-center mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {isLogin ? 'Login' : 'Create Account'}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 font-medium">
              Wimalarathna Hardware
            </p>
          </div>

          {/* Standard Alerts */}
          {success && (
            <div className="mb-3 sm:mb-4 flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-green-900 shadow-sm animate-fade-in">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/></svg>
              <span className="font-semibold">{success}</span>
            </div>
          )}
          {error && (
            <div className="mb-3 sm:mb-4 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-800 shadow-sm animate-fade-in">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/></svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}
          {!success && !error && (
            <Alert className="mb-3 sm:mb-4 bg-blue-50 text-blue-900 border-blue-200 flex items-center gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/></svg>
              <span className="text-xs sm:text-sm md:text-base">{isLogin ? 'Please enter your username and password to login.' : 'Fill in the form to create a new account.'}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="username" className="text-gray-900 font-medium">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
                required
                className="h-10 sm:h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-gray-900 bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                required
                className="h-10 sm:h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-gray-900 bg-white placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setSuccess('')
                setUsername('')
                setPassword('')
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </Card>
      </main>
    </>
  )
}
