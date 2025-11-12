import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../services/operations/authAPI'
import { updateUser, deleteUser } from '../services/operations/userAPI'
import MainLayout from '../components/MainLayout'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  // Redirect non-admin users
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/')
    }
  }, [currentUser, navigate])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.data || [])
      } else {
        alert(result.message || 'Failed to fetch users')
      }
    } catch (err) {
      alert('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?.id) {
      alert("You cannot delete your own account")
      return
    }

    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return

    try {
      const result = await deleteUser(userId)
      if (result.success) {
        await fetchUsers()
      } else {
        alert(result.message || 'Failed to delete user')
      }
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const handleRoleChange = async (userId) => {
    if (userId === currentUser?.id) {
      alert("You cannot change your own role")
      setEditingUser(null)
      return
    }

    if (!newRole) {
      alert('Please select a role')
      return
    }

    try {
      const result = await updateUser(userId, { role: newRole })
      if (result.success) {
        await fetchUsers()
        setEditingUser(null)
        setNewRole('')
      } else {
        alert(result.message || 'Failed to update role')
      }
    } catch (err) {
      alert('Failed to update role')
    }
  }

  const startEditRole = (user) => {
    setEditingUser(user._id)
    setNewRole(user.role)
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setNewRole('')
  }

  if (currentUser?.role !== 'admin') {
    return null
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">User Management</h1>
              <p className="text-sm text-slate-600">
                Manage all registered users, change roles, and remove users from the system.
              </p>
            </div>
            <Button variant="outline" onClick={fetchUsers} className="w-full sm:w-auto">
              Refresh
            </Button>
          </div>
        </div>

        {/* Users List - Desktop Table / Mobile Cards */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-600">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-600">No users found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 lg:px-6">
                        Name
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 lg:px-6">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 lg:px-6">
                        Role
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 lg:px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-4 lg:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-slate-900 block truncate">{user.name}</span>
                              {user._id === currentUser?.id && (
                                <span className="mt-1 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 lg:px-6">
                          <span className="block truncate">{user.email}</span>
                        </td>
                        <td className="px-4 py-4 lg:px-6">
                          {editingUser === user._id ? (
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleRoleChange(user._id)}
                                >
                                  Save
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 lg:px-6">
                          <div className="flex items-center justify-end gap-2">
                            {editingUser === user._id ? null : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  to={`/users/${user._id}/tasks`}
                                >
                                  View Tasks
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditRole(user)}
                                  disabled={user._id === currentUser?.id}
                                >
                                  Change Role
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user._id, user.name)}
                                  disabled={user._id === currentUser?.id}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {users.map((user) => (
                  <div key={user._id} className="p-4 space-y-4">
                    {/* User Info */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{user.name}</h3>
                          {user._id === currentUser?.id && (
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate mt-1">{user.email}</p>
                        <div className="mt-2">
                          {editingUser === user._id ? (
                            <div className="space-y-2">
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleRoleChange(user._id)}
                                  className="flex-1"
                                >
                                  Save
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEdit} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {editingUser === user._id ? null : (
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          to={`/users/${user._id}/tasks`}
                          className="w-full"
                        >
                          View Tasks
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditRole(user)}
                            disabled={user._id === currentUser?.id}
                            className="flex-1"
                          >
                            Change Role
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            disabled={user._id === currentUser?.id}
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Total Users</span>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Admins</span>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {users.filter((u) => u.role === 'admin').length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Regular Users</span>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {users.filter((u) => u.role === 'user').length}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
