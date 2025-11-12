import React from 'react'
import { useNavigate } from 'react-router-dom'
import { updateTaskStatus, deleteTask } from '../services/operations/taskAPI'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'

const PRIORITY_STYLES = {
  high: 'border-red-300 bg-red-100',
  medium: 'border-amber-300 bg-amber-100',
  low: 'border-emerald-300 bg-emerald-100'
}

export default function TaskCard({ task, onEdit, onRefresh, onDragStart, onDragEnd }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const assigneeId =
    typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo._id : task.assignedTo
  const canUpdateStatus = isAdmin || assigneeId === user?.id

  const assigneeName = typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo.name : undefined
  const ownerName = typeof task.owner === 'object' && task.owner !== null ? task.owner.name : undefined
  const priorityLabel = task.priority ? `${task.priority.charAt(0).toUpperCase()}${task.priority.slice(1)}` : 'General'
  const isDraggable = canUpdateStatus

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or dragging
    if (e.target.closest('button') || e.defaultPrevented) {
      return
    }
    navigate(`/tasks/${task._id}`)
  }

  const toggleStatus = async () => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending'
      const result = await updateTaskStatus(task._id, newStatus)
      if (result.success) {
        if (onRefresh) onRefresh()
      } else {
        alert(result.message || 'Failed to update task')
      }
    } catch (err) {
      alert('Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (!isAdmin) return
    if (!confirm('Delete this task?')) return
    try {
      const result = await deleteTask(task._id)
      if (result.success) {
        if (onRefresh) onRefresh()
      } else {
        alert(result.message || 'Failed to delete task')
      }
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  const cardTone = PRIORITY_STYLES[task.priority] || 'border-slate-100 bg-white/95'

  const handleDragStart = (event) => {
    if (!isDraggable) return
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task._id)
    if (onDragStart) onDragStart(task)
  }

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd()
  }

  return (
    <article
      className={`group flex items-center gap-3 rounded-xl border p-3 text-slate-900 shadow-sm transition hover:shadow-md cursor-pointer ${cardTone} ${
        isDraggable ? 'active:cursor-grabbing' : ''
      }`}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
    >
      {/* Priority Badge */}
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          task.priority === 'high'
            ? 'bg-red-100 text-red-700'
            : task.priority === 'medium'
            ? 'bg-amber-100 text-amber-700'
            : task.priority === 'low'
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {priorityLabel}
      </span>

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 truncate">{task.title}</h3>
      </div>

      {/* Due Date */}
      <span className="text-xs text-slate-600 whitespace-nowrap">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
      </span>

      {/* Status Badge */}
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
          task.status === 'pending' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {task.status === 'pending' ? 'Pending' : 'Completed'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {canUpdateStatus && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleStatus}
            title={task.status === 'pending' ? 'Mark as completed' : 'Mark as pending'}
            className="text-slate-400 hover:text-slate-600"
          >
            {task.status === 'pending' ? '✓' : '↻'}
          </Button>
        )}
        {isAdmin && onEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            title="Edit task"
            className="text-slate-400 hover:text-slate-600"
          >
            ✎
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            title="Delete task"
            className="text-slate-400 hover:text-red-600"
          >
            ×
          </Button>
        )}
      </div>
    </article>
  )
}
