import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', age: 25, gender: 'other', interests: '', location: '' })
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, interests: form.interests.split(',').map(s=>s.trim()).filter(Boolean) }
      await register(payload)
      nav('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-2">Register</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div><label className="label">Name</label><input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></div>
        <div><label className="label">Email</label><input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
        <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /></div>
        <div className="grid2">
          <div><label className="label">Age</label><input className="input" type="number" value={form.age} onChange={e=>setForm({...form, age:+e.target.value})} /></div>
          <div><label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </div>
        </div>
        <div><label className="label">Interests (comma-separated)</label><input className="input" value={form.interests} onChange={e=>setForm({...form, interests:e.target.value})} /></div>
        <div><label className="label">Location</label><input className="input" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} /></div>
        <button className="btn w-full">Create account</button>
      </form>
      <p className="text-sm mt-2">Have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
