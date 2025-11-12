import React, { useEffect, useState } from 'react'
import { createTask, updateTask } from '../services/operations/taskAPI'
import { getAllUsers } from '../services/operations/authAPI'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'

export default function TaskForm({ task = {}, onClose, onSaved }) {
  const [title, setTitle] = useState(task.title || '')
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 16) : '')
  const [priority, setPriority] = useState(task.priority || 'low')
  const [assignedTo, setAssignedTo] = useState(
    task.assignedTo?._id || (typeof task.assignedTo === 'string' ? task.assignedTo : '') || ''
  )
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    setTitle(task.title || '')
    setDescription(task.description || '')
    setPriority(task.priority || 'low')
    setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : '')
    setAssignedTo(task.assignedTo?._id || (typeof task.assignedTo === 'string' ? task.assignedTo : '') || '')
  }, [task])

  useEffect(() => {
    if (user?.role !== 'admin') return
    const fetchUsers = async () => {
      setUsersLoading(true)
      try {
        const result = await getAllUsers()
        if (result.success) {
          setUsers(result.data || [])
        } else {
          setError('Failed to load users')
        }
      } catch (err) {
        setError('Failed to load users')
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (!assignedTo) {
        setError('Please select a user to assign this task to')
        return
      }

      const payload = { title, description, dueDate: dueDate || null, priority, assignedTo }
      
      let result
      if (task._id) {
        result = await updateTask(task._id, payload)
      } else {
        result = await createTask(payload)
      }

      if (result.success) {
        if (onSaved) await onSaved()
        if (onClose) onClose()
      } else {
        setError(result.message || 'Failed to save task')
      }
    } catch (err) {
      setError('Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form
        className="w-full max-w-md lg:max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{task._id ? 'Update task' : 'Create task'}</h3>
            <p className="mt-1 text-sm text-slate-600">Assign work, set expectations, and keep things moving.</p>
          </div>
          <Button
            type="button"
            variant="icon"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </Button>
        </div>

        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to get done?"
              className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Assign to</label>
            {usersLoading ? (
              <p className="text-sm text-slate-500">Loading users…</p>
            ) : (
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="" disabled>
                  Select a teammate
                </option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            )}
            {!usersLoading && users.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">
                No users found. Invite someone to assign this task.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Due date</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save task'}
          </Button>
        </div>
      </form>
    </div>
  )
}
