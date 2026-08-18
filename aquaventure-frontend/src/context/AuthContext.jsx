import { createContext, useContext, useMemo, useState } from 'react'
import { login as loginApi, register as registerApi } from '../api/authApi'

const AuthContext = createContext(null)

function readStoredUser() {
  const raw = localStorage.getItem('authUser')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const persist = (loginResponse) => {
    const { token, ...profile } = loginResponse
    localStorage.setItem('authToken', token)
    localStorage.setItem('authUser', JSON.stringify(profile))
    setUser(profile)
  }

  const login = async (email, password) => {
    const response = await loginApi({ email, password })
    persist(response)
    return response
  }

  const register = async (data) => {
    await registerApi(data)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
