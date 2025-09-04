import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('eventx_auth')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('eventx_token'))

  useEffect(() => {
    if (user) localStorage.setItem('eventx_auth', JSON.stringify(user))
    else localStorage.removeItem('eventx_auth')
  }, [user])
  useEffect(() => {
    if (token) localStorage.setItem('eventx_token', token)
    else localStorage.removeItem('eventx_token')
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user); setToken(data.token)
  }
  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload)
    setUser(data.user); setToken(data.token)
  }
  const logout = () => { setUser(null); setToken(null) }

  api.interceptors.request.use(cfg => {
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
  })

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
