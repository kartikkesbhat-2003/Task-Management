import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'

export default function MainLayout({ children, onCreateTask }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      to: '/',
      isActive: location.pathname === '/'
    },
    ...(user?.role === 'admin' ? [{
      key: 'users',
      label: 'Users',
      to: '/users',
      isActive: location.pathname === '/users'
    }] : [])
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50 text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-6 border-r border-slate-200 bg-white p-6 shadow-xl transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white text-lg font-bold shadow-lg">
              ST
            </span>
            <div>
              <p className="text-base font-bold text-slate-900">Sintask</p>
              <p className="text-xs text-slate-500">Product Design</p>
            </div>
          </div>
          <Button type="button" className="lg:hidden" variant="icon" size="icon" onClick={toggleSidebar}>
            <span className="sr-only">Close navigation</span>×
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 -mx-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-slate-400 px-6">Navigation</p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.to}
                    onClick={closeSidebar}
                    className={`group relative flex w-full items-center justify-between px-6 py-2.5 text-sm font-semibold transition-all ${
                      item.isActive 
                        ? 'text-primary bg-primary/10 border-l-4 border-primary pl-[20px]' 
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {user && (
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Signed in</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/40 bg-white text-primary font-semibold">
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {onCreateTask && (
            <Button
              onClick={() => {
                onCreateTask()
                closeSidebar()
              }}
              variant="accent"
              className="lg:hidden"
            >
              Add new task
            </Button>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={() => {
              logout()
              closeSidebar()
            }}
            variant="outline"
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-slate-50/80 px-4 backdrop-blur lg:px-10">
          <Button
            className="lg:hidden"
            variant="icon"
            size="icon"
            onClick={toggleSidebar}
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            ☰
          </Button>
          <div className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm sm:flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, label, task or team member..."
              className="flex-1 border-none bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            
            {onCreateTask && (
              <Button
                onClick={() => {
                  onCreateTask()
                  closeSidebar()
                }}
                variant="accent"
                className="hidden lg:inline-flex"
              >
                Add new task
              </Button>
            )}
            <Button
              onClick={() => {
                logout()
                closeSidebar()
              }}
              variant="outline"
              className="hidden lg:inline-flex"
            >
              Sign out
            </Button>

            {user && (
              <div className="flex items-center rounded-full bg-white px-3 py-1.5 ">
                <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-white text-primary font-semibold">
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-10">{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={closeSidebar} />}
    </div>
  )
}
