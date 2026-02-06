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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-3 md:p-4">
      <Card className="w-full max-w-md p-6 md:p-8 bg-white shadow-xl border-gray-200">
        <div className="text-center mb-6 md:mb-8">
          <div className="mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isLogin ? 'Login' : 'Create Account'}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
            Wimalrathna Hardware
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-900 font-medium">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              required
              className="h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-gray-900 bg-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900 font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              required
              className="h-11 border-gray-300 focus:border-blue-600 focus:ring-blue-600 text-gray-900 bg-white placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-6"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSuccess('')
              setUsername('')
              setPassword('')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
            disabled={loading}
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </Card>
    </main>
  )
}
