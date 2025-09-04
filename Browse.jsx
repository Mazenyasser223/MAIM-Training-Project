import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext.jsx'

export default function Browse() {
  const { api } = useAuth()
  const [events, setEvents] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const load = async () => {
    const params = new URLSearchParams()
    if (q) params.set('search', q)
    if (status) params.set('status', status)
    const { data } = await api.get(`/api/events?${params}`)
    setEvents(data)
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="card mb-4">
        <div className="grid2">
          <input className="input" placeholder="Search events..." value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="mt-3"><button className="btn" onClick={load}>Apply</button></div>
      </div>

      <div className="grid3">
        {events.map(ev => (
          <div key={ev._id} className="card">
            <div className="text-sm text-gray-500">{new Date(ev.date).toLocaleString()}</div>
            <h3 className="font-bold text-lg">{ev.title}</h3>
            <div className="text-gray-600">{ev.venue}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-bold">${ev.price}</span>
              <span className="text-xs bg-gray-100 rounded px-2 py-1">{ev.status}</span>
              <span className="text-xs bg-gray-100 rounded px-2 py-1">Popularity {ev.popularity}</span>
            </div>
            <Link className="btn mt-3 inline-block" to={`/event/${ev._id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
