import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed')
    }
  }

  return (
    <AuthLayout
      heading="Build Momentum With Every Sprint"
      subheading="Assign work, visualize progress, and celebrate wins across every team."
      ctaHref="/login"
      ctaText="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Create your workspace</h2>
          <p className="text-sm text-slate-600">Get started in minutes. No credit card required.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" fullWidth>
          Create account
        </Button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-600 transition">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
