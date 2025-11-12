import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAllTasks } from '../services/operations/taskAPI'
import MainLayout from '../components/MainLayout'
import TaskCard from '../components/TaskCard'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

export default function UserTasks() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const { user: currentUser } = useAuth()

  // Redirect non-admin users
  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/')
    }
  }, [currentUser, navigate])

  const fetchUserTasks = async () => {
    setLoading(true)
    try {
      const result = await getAllTasks({ limit: 100 })
      if (result.success) {
        const allTasks = result.data.tasks || []
        // Filter tasks assigned to or owned by this user
        const userTasks = allTasks.filter(task => {
          const assigneeId = typeof task.assignedTo === 'object' ? task.assignedTo?._id : task.assignedTo
          const ownerId = typeof task.owner === 'object' ? task.owner?._id : task.owner
          return assigneeId === userId || ownerId === userId
        })
        setTasks(userTasks)
        
        // Get user name from first task
        if (userTasks.length > 0) {
          const firstTask = userTasks[0]
          if (typeof firstTask.assignedTo === 'object' && firstTask.assignedTo?._id === userId) {
            setUserName(firstTask.assignedTo.name)
          } else if (typeof firstTask.owner === 'object' && firstTask.owner?._id === userId) {
            setUserName(firstTask.owner.name)
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserTasks()
  }, [userId])

  const onRefresh = async () => {
    await fetchUserTasks()
  }

  if (currentUser?.role !== 'admin') {
    return null
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon-sm" onClick={() => navigate('/users')}>
                  ←
                </Button>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {userName ? `${userName}'s Tasks` : 'User Tasks'}
                </h1>
              </div>
              <p className="text-sm text-slate-600">
                All tasks assigned to or created by this user.
              </p>
            </div>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-primary/10 p-3 sm:p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Total Tasks</span>
              <span className="text-xl sm:text-2xl font-semibold text-slate-900">{tasks.length}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pending</span>
              <span className="text-xl sm:text-2xl font-semibold text-slate-900">{pendingTasks.length}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Completed</span>
              <span className="text-xl sm:text-2xl font-semibold text-slate-900">{completedTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-soft">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-soft">
            No tasks found for this user.
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Pending Tasks */}
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
              <header className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Pending
                  </span>
                  <p className="mt-2 text-sm text-slate-400">{pendingTasks.length} items</p>
                </div>
              </header>

              {pendingTasks.length > 0 ? (
                <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide max-h-[60vh] lg:max-h-[calc(100vh-28rem)]">
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onRefresh={onRefresh}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                  No pending tasks.
                </p>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-card">
              <header className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Completed
                  </span>
                  <p className="mt-2 text-sm text-slate-400">{completedTasks.length} items</p>
                </div>
              </header>

              {completedTasks.length > 0 ? (
                <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide max-h-[60vh] lg:max-h-[calc(100vh-28rem)]">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onRefresh={onRefresh}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                  No completed tasks.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
