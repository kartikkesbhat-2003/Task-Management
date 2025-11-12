import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <AuthLayout
      heading="Streamline Tasks, Maximize Output"
      subheading="Track progress, surface blockers, and keep every initiative moving with confidence."
      ctaHref="/register"
      ctaText="Create account"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-600">Enter your details to access your workspace.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

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
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button type="submit" fullWidth>
          Sign in
        </Button>

        <p className="text-center text-sm text-slate-600">
          New to Task?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-600 transition">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
