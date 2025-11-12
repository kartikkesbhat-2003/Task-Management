import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskById, updateTaskStatus } from '../services/operations/taskAPI'
import MainLayout from '../components/MainLayout'
import Button from '../components/Button'
import TaskForm from '../components/TaskForm'
import { useAuth } from '../contexts/AuthContext'

export default function TaskDetails() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [editing, setEditing] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const assigneeId =
    task && typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo._id : task?.assignedTo
  const canUpdateStatus = isAdmin || assigneeId === user?.id

  useEffect(() => {
    const loadTask = async () => {
      try {
        const result = await getTaskById(id)
        if (result.success) {
          setTask(result.data)
        } else {
          navigate('/')
        }
      } catch (err) {
        navigate('/')
      }
    }

    loadTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const toggleStatus = async () => {
    if (!task) return
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending'
    try {
      const result = await updateTaskStatus(task._id, nextStatus)
      if (result.success) {
        setTask((prev) => (prev ? { ...prev, status: nextStatus } : prev))
      } else {
        alert(result.message || 'Failed to update status')
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleSaved = async () => {
    try {
      const result = await getTaskById(id)
      if (result.success) {
        setTask(result.data)
      }
    } catch (err) {
      // ignore – keep existing task
    } finally {
      setEditing(null)
    }
  }

  if (!task)
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-slate-600">Loading task details...</p>
          </div>
        </div>
      </MainLayout>
    )

  const priorityColors = {
    high: 'border-red-300 bg-red-100 text-red-700',
    medium: 'border-amber-300 bg-amber-100 text-amber-700',
    low: 'border-emerald-300 bg-emerald-100 text-emerald-700'
  }

  const priorityColor = priorityColors[task.priority] || 'border-slate-200 bg-slate-100 text-slate-700'

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" size="md" onClick={() => navigate(-1)}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
                  task.status === 'pending' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {task.status === 'pending' ? '⏳ Pending' : '✓ Completed'}
              </span>
              {canUpdateStatus && (
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={toggleStatus}
                >
                  {task.status === 'pending' ? 'Mark Complete' : 'Reopen Task'}
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setEditing(task)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Task Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title & Description */}
            <div className={`rounded-3xl border p-6 shadow-soft ${priorityColor}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{task.title}</h1>
                  </div>
                  {task.description && (
                    <p className="text-base text-slate-700 leading-relaxed">{task.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Task Metadata */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Task Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned to</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                      {task.assignedTo?.name || 'Unassigned'}
                    </p>
                    {task.assignedTo?.email && (
                      <p className="text-xs text-slate-600 truncate">{task.assignedTo.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created by</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                      {task.owner?.name || 'Unknown'}
                    </p>
                    {task.owner?.email && (
                      <p className="text-xs text-slate-600 truncate">{task.owner.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Due date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Not set'}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-slate-600">
                        {new Date(task.dueDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</p>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Quick Stats</h3>
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Status</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 capitalize">{task.status}</p>
                </div>
                
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Created</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {new Date(task.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Last Updated</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {new Date(task.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {editing && isAdmin && (
        <TaskForm task={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </MainLayout>
  )
}
