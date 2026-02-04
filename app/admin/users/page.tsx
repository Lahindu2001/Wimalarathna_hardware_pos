'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: number
  username: string
  status: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: number, status: string) => {
    try {
      setError('')
      setSuccess('')
      
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update user status')
      }

      setSuccess(`User status updated to ${status}`)
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'rejected':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-900">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Button onClick={() => router.push('/pos')} variant="outline">
            Back to POS
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-900 font-semibold">ID</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Username</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-900 font-semibold">Created At</TableHead>
                    <TableHead className="text-gray-900 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b border-gray-200">
                      <TableCell className="text-gray-900">{user.id}</TableCell>
                      <TableCell className="text-gray-900 font-medium">{user.username}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-900">{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateUserStatus(user.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, 'pending')}
                          >
                            Set Pending
                          </Button>
                        )}
                        {user.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => updateUserStatus(user.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {users.length === 0 && (
              <p className="text-center py-8 text-gray-500">No users found</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">User Status Guide:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li><strong>Pending:</strong> New user waiting for approval - cannot login</li>
            <li><strong>Approved:</strong> User can login and access the system</li>
            <li><strong>Rejected:</strong> User cannot login - access denied</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
