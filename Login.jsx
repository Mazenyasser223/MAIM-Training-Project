import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@eventx.com')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div><label className="label">Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="btn w-full">Login</button>
      </form>
      <p className="text-sm mt-2">No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
