import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as loginAPI, signUp as signUpAPI, logout as logoutAPI } from '../services/operations/authAPI'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed ? { ...parsed, role: parsed.role || 'user' } : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }, [user])

  const login = async (email, password) => {
    const result = await loginAPI(email, password)
    if (!result.success) {
      throw new Error(result.message)
    }
    const { user: u } = result.data
    setUser(u)
    return u
  }

  const register = async (name, email, password, role) => {
    const result = await signUpAPI(name, email, password, role)
    if (!result.success) {
      throw new Error(result.message)
    }
    const { user: u } = result.data
    setUser(u)
    return u
  }

  const logout = () => {
    logoutAPI()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
