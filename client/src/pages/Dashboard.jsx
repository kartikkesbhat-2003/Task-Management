import React, { useEffect, useMemo, useState } from 'react'
import { getAllTasks, updateTaskStatus } from '../services/operations/taskAPI'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import MainLayout from '../components/MainLayout'
import Button from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

const COLUMNS = [
  {
    key: 'pending',
    title: 'Pending',
    badgeClass: 'bg-sky-100 text-sky-700',
    filter: (task) => task.status === 'pending',
    allowCreate: true
  },
  {
    key: 'completed',
    title: 'Completed',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    filter: (task) => task.status === 'completed',
    allowCreate: false
  }
]

const SUMMARY_CARDS = [
  {
    key: 'total',
    label: 'Total tasks',
    accent: 'border-primary/20 bg-primary/10 text-primary-700',
    getValue: (stats) => stats.total
  },
  {
    key: 'pending',
    label: 'Pending',
    accent: 'border-amber-200 bg-amber-50 text-amber-700',
    getValue: (stats) => stats.pending
  },
  {
    key: 'completed',
    label: 'Completed',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    getValue: (stats) => stats.completed
  },
  {
    key: 'overdue',
    label: 'Overdue',
    accent: 'border-red-200 bg-red-50 text-red-700',
    getValue: (stats) => stats.overdue
  }
]

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [draggingTask, setDraggingTask] = useState(null)
  const [mobileView, setMobileView] = useState('pending') // 'pending' or 'completed'
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const fetchTasks = async (page = currentPage, limit = pageSize) => {
    setLoading(true)
    try {
      const result = await getAllTasks({ page, limit })
      if (result.success) {
        setTasks(result.data.tasks || [])
        setTotalPages(result.data.pages || 1)
        setTotalTasks(result.data.total || 0)
        setCurrentPage(result.data.page || 1)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize])

  const onCreateOrUpdate = async () => {
    await fetchTasks(currentPage, pageSize)
    setEditing(null)
  }

  const onRefresh = async () => {
    await fetchTasks(currentPage, pageSize)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleDragStart = (task) => {
    setDraggingTask(task)
  }

  const handleDragEnd = () => {
    setDraggingTask(null)
  }

  const handleDrop = async (status) => {
    if (!draggingTask) return
    if (draggingTask.status === status) {
      setDraggingTask(null)
      return
    }

    try {
      const result = await updateTaskStatus(draggingTask._id, status)
      if (result.success) {
        await fetchTasks(currentPage, pageSize)
      } else {
        alert(result.message || 'Failed to move task')
      }
    } catch (err) {
      alert('Failed to move task')
    } finally {
      setDraggingTask(null)
    }
  }

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'pending').length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false
      const due = new Date(t.dueDate)
      return due < new Date() && t.status !== 'completed'
    }).length
    const highPriority = tasks.filter((t) => t.priority === 'high' && t.status === 'pending').length

    return { total: tasks.length, pending, completed, overdue, highPriority }
  }, [tasks])

  const openCreate = (priority = 'medium') => {
    if (!isAdmin) return
    setEditing({ priority })
  }

  return (
    <MainLayout onCreateTask={isAdmin ? () => openCreate('high') : undefined}>
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.name ? `${user.name.split(' ')[0]}'s task dashboard` : 'Task dashboard'}
              </h1>
              <p className="text-sm text-slate-600">
                {isAdmin ? 'Review and manage the work you have assigned.' : 'Track tasks that have been assigned to you.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={fetchTasks}>
                Refresh
              </Button>
              {isAdmin && (
                <Button variant="primary" onClick={() => openCreate('high')}>
                  Add new task
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {SUMMARY_CARDS.map((card) => {
              const value = card.getValue(stats)
              return (
                <div
                  key={card.key}
                  className={`flex flex-col gap-2 rounded-2xl border p-3 sm:p-4 shadow-sm ${card.accent}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{card.label}</span>
                  <span className="text-xl sm:text-2xl font-semibold">{value}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile view toggle */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 lg:hidden">
          <button
            onClick={() => setMobileView('pending')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mobileView === 'pending'
                ? 'bg-sky-100 text-sky-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setMobileView('completed')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mobileView === 'completed'
                ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter(column.filter)
            const isActiveDrop =
              draggingTask && draggingTask.status !== column.key &&
              ((column.key === 'pending' && draggingTask.status === 'completed') ||
                (column.key === 'completed' && draggingTask.status === 'pending'))
            
            // Hide column on mobile if not selected
            const isHiddenOnMobile = mobileView !== column.key

            return (
              <div
                key={column.key}
                className={`flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-card transition ${
                  isActiveDrop ? 'border-2 border-primary/40 bg-primary/5' : 'border border-transparent'
                } ${isHiddenOnMobile ? 'hidden lg:flex' : 'flex'}`}
                onDragOver={(event) => {
                  if (!draggingTask) return
                  event.preventDefault()
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDrop(column.key)
                }}
              >
                <header className="flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${column.badgeClass}`}>
                      {column.title}
                    </span>
                    <p className="mt-2 text-sm text-slate-400">{columnTasks.length} items</p>
                  </div>
                  {isAdmin && column.allowCreate && (
                    <Button
                      variant="icon"
                      size="icon-sm"
                      onClick={() => openCreate()}
                      title="Add task"
                    >
                      +
                    </Button>
                  )}
                </header>

                {loading ? (
                  <p className="text-sm text-slate-500">Loading…</p>
                ) : columnTasks.length ? (
                  <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide max-h-[60vh] lg:max-h-[calc(100vh-28rem)]">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={isAdmin ? () => setEditing(task) : undefined}
                        onRefresh={onRefresh}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                    No tasks here yet.
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>
                Showing <span className="font-semibold text-slate-900">{tasks.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{totalTasks}</span> tasks
              </span>
              <span className="text-slate-400">|</span>
              <label htmlFor="pageSize" className="flex items-center gap-2">
                Per page:
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="px-2 text-slate-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </section>

      {editing && isAdmin && <TaskForm task={editing} onClose={() => setEditing(null)} onSaved={onCreateOrUpdate} />}
    </MainLayout>
  )
}
