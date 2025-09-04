import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext.jsx'

export default function EventForm() {
  const { api } = useAuth()
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', date:'', venue:'', price:0, totalSeats:50, status:'upcoming' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      (async () => {
        const { data } = await api.get(`/api/events/${id}`)
        const iso = new Date(data.date).toISOString().slice(0,16)
        setForm({ ...data, date: iso })
      })()
    }
  }, [id])

  const save = async (e) => {
    e.preventDefault()
    try {
      if (id) await api.put(`/api/events/${id}`, { ...form, date: new Date(form.date) })
      else await api.post(`/api/events`, { ...form, date: new Date(form.date) })
      nav('/admin/events')
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-bold mb-2">{id ? 'Edit' : 'Add'} Event</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
      <form className="space-y-3" onSubmit={save}>
        <div><label className="label">Title</label><input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></div>
        <div><label className="label">Description</label><textarea className="input" rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea></div>
        <div className="grid2">
          <div><label className="label">Date & Time</label><input type="datetime-local" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} /></div>
          <div><label className="label">Venue</label><input className="input" value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} /></div>
        </div>
        <div className="grid2">
          <div><label className="label">Price</label><input type="number" className="input" value={form.price} onChange={e=>setForm({...form, price:+e.target.value})} /></div>
          <div><label className="label">Total Seats</label><input type="number" className="input" value={form.totalSeats} onChange={e=>setForm({...form, totalSeats:+e.target.value})} /></div>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option value="upcoming">upcoming</option>
            <option value="active">active</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <button className="btn">Save</button>
      </form>
    </div>
  )
}
